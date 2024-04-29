<template>
  <div>
    <div ref="globeViz"></div>
    <div id="time-log"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import * as satellite from "satellite.js";
import axios from "axios";

export default {
  name: "GlobeVisualization",
  setup() {
    const globeViz = ref(null);
    const satelliteData = ref([]);
    let isDataLoaded = ref(false);

    onMounted(async () => {
      const EARTH_RADIUS_KM = 6371;
      const SAT_SIZE = 1;
      const TIME_STEP = 3 * 1000;

      const timeLogger = document.getElementById("time-log");
      // console.log(timeLogger);

      const N = 10;
      const gData = [...Array(N).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        alt: 0.3,
        radius: Math.random() * 5,
        color: ["white", "blue", "green"][Math.round(Math.random() * 3)],
      }));

      // const lData = [...Array(195).keys()].map(() => ({
      //   lat: (Math.random() - 0.5) * 180,
      //   lng: (Math.random() - 0.5) * 360,
      //   alt: Math.random(),
      //   size: Math.random(),
      //   color: "red",
      // }));

      async function fetchData() {
        try {
          const response = await fetch(
            "../../datasets/populated_place.geojson"
          );
          const country = await response.json();
          return country.features;
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error;
        }
      }

      async function getCountries() {
        try {
          const geoData = await fetchData();
          // Filter data before mapping
          const filteredData = geoData.filter((feature) => {
            const { properties } = feature;
            return properties.name !== undefined;
          });
          const countries = filteredData.map((feature) => {
            const { properties, geometry } = feature;
            return {
              name: properties.name,
              lat: geometry.coordinates[1], // Assuming second value is latitude
              lng: geometry.coordinates[0], // Assuming first value is longitude
              size: properties.size || 1,
              color: "red",
              // Access other properties as needed: tld, iso3, iso2
            };
          });
          return countries;
        } catch (error) {
          console.error("Error processing data:", error);
          throw error;
        }
      }

      const countries = await getCountries();
      // console.log(countries);

      // console.log(gData);
      const satelliteGeometry = new THREE.BufferGeometry();
      const vertices = [
        -0.25, -0.25, 0.25, 0.25, -0.25, 0.25, 0.25, 0.25, 0.25, -0.25, 0.25,
        0.25,

        -0.25, -0.25, -0.25, 0.25, -0.25, -0.25, 0.25, 0.25, -0.25, -0.25, 0.25,
        -0.25,
      ];

      // Define indices to connect vertices into faces
      const indices = [
        0, 1, 2, 0, 2, 3,

        4, 6, 5, 4, 7, 6,

        3, 2, 6, 3, 6, 7,

        0, 5, 1, 0, 4, 5,

        1, 5, 6, 1, 6, 2,

        0, 3, 7, 0, 7, 4,
      ];

      // Set the vertices and indices to the BufferGeometry
      satelliteGeometry.setIndex(indices);
      satelliteGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const Globe = new ThreeGlobe()
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        )
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .objectLat("lat")
        .objectLng("lng")
        .objectAltitude("alt")
        .objectFacesSurface(false)
        .labelsData(countries)
        .labelText((d) => d.name)
        .labelSize((d) => d.size * 0.5)
        .labelDotRadius(0.35)
        .labelColor("color")
        .customLayerData(satelliteData.value)
        .objectThreeObject((d) => {
          // Material for the satellite
          const satMaterial = new THREE.MeshBasicMaterial({ color: "white" });
          // Create a mesh for the satellite
          const satelliteMesh = new THREE.Mesh(satelliteGeometry, satMaterial);
          // Set the initial position of the satellite
          // satelliteMesh.position.copy(Globe.getCoords(d.lat, d.lng, d.alt));
          return satelliteMesh;
        })
        // .customThreeObject((d) => {
        //   // Material for the satellite
        //   const satMaterial = new THREE.MeshBasicMaterial({ color: "white" });
        //   // Create a mesh for the satellite
        //   const satelliteMesh = new THREE.Mesh(satelliteGeometry, satMaterial);
        //   // Set the initial position of the satellite
        //   satelliteMesh.position.copy(Globe.getCoords(d.lat, d.lng, d.alt));
        //   return satelliteMesh;
        // })

        .customThreeObjectUpdate((obj, d) => {
          obj.position.copy(Globe.getCoords(d.lat, d.lng, d.alt));
        });

      // Function to fetch satellite positions from backend
      const fetchSatellitePositions = async () => {
        try {
          // const currentUTC = new Date().toISOString();
          // Make a GET request to your backend API endpoint using Axios
          const response = await axios.get(
            "http://localhost:5000/api/satellite_position"
          );
          let data = response.data.data;
          data.forEach((element) => {
            element.lat = parseFloat(element.lat);
            element.lng = parseFloat(element.lng);
            element.altitude = parseFloat(element.altitude);
            element.radius = 0.3;
            element.alt = 0.3;
            element.color = "white";
          });
          satelliteData.value = data;
          isDataLoaded.value = true;
          // console.log(satelliteData.value);
          Globe.objectsData(satelliteData.value);
        } catch (error) {
          console.error("Error fetching satellite positions:", error);
        }
      };
      setInterval(fetchSatellitePositions, 1000);
      // time ticker
      // let time = new Date();
      // (function frameTicker() {
      //   requestAnimationFrame(frameTicker);

      //   time = new Date(+time + TIME_STEP);
      //   timeLogger.innerText = time.toString();

      //   // Update satellite positions
      //   fetchSatellitePositions();
      //   console.log(satelliteData.value);

      //   Globe.objectsData(satelliteData.value);
      // })();

      // Setup renderer
      const rendererConfig = {
        antialias: true,
        alpha: true,
      };
      const renderer = new THREE.WebGLRenderer(rendererConfig);
      renderer.setSize(window.innerWidth, window.innerHeight);
      // if (globeViz.value !== null) {
      //   globeViz.value.appendChild(renderer.domElement);
      // }
      globeViz.value.appendChild(renderer.domElement);

      // Setup scene
      const scene = new THREE.Scene();
      scene.add(Globe);
      scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
      scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));
      //Load background texture
      // const loader = new THREE.TextureLoader();
      // loader.load("../../images/sky.jpg", function (texture) {
      //   scene.background = texture;
      // });
      scene.background = new THREE.Color(0x000000);
      // Setup camera
      const camera = new THREE.PerspectiveCamera();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 400;

      // Add camera controls
      const tbControls = new TrackballControls(camera, renderer.domElement);
      tbControls.minDistance = 101;
      tbControls.rotateSpeed = 3;
      tbControls.zoomSpeed = 1;

      const raycaster = new THREE.Raycaster();

      // Create a mouse vector to represent the mouse position
      const mouse = new THREE.Vector2();

      // Add a click event listener to the renderer element
      renderer.domElement.addEventListener("click", onClick);

      function onClick(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the mouse position and camera
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections between the raycaster and the buffer geometry objects
        const intersects = raycaster.intersectObjects(scene.children);

        // If there are intersections, handle the interaction
        if (intersects.length > 0) {
          // Assuming you have set up userData on your buffer geometry objects
          const object = intersects[0].object;

          // Handle the interaction, for example, log the object's userData
          console.log(object.userData);

          // You can also perform other actions such as highlighting the object, opening a modal, etc.
        }
      }

      // Kick-off renderer
      (function animate() {
        tbControls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      })();
    });

    return { globeViz, isDataLoaded, satelliteData };
  },
};
</script>
