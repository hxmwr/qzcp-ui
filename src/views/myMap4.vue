<template>
  <div id="map" style="height: 100vh">
    <l-map
      ref="myMap"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :lat-lng="markerLatLng" >
        <l-popup>Hello!</l-popup>
      </l-marker>
      <l-polyline
        :lat-lngs="polyline.latlngs"
        :color="polyline.color">
      </l-polyline>
      <l-heat-map :lat-lng="latlngs" :radius="60" :min-opacity=".75" :max-zoom="10" :blur="60"></l-heat-map>
    </l-map>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        url: 'http://172.16.0.34:4040/map/{z}/{x}/{y}.png',
        center: [28.966173, 118.84945],
        zoom: 15,
        bounds: null,
        markerLatLng: [28.966173, 118.84945],
        polyline: {
          latlngs: [[28.966173, 118.84945], [28.986173, 118.84945], [28.966173, 118.94945], [28.968173, 118.84445]],
          color: 'green'
        },
        latlngs: [[28.966173, 118.84945, 0.7], [28.966173, 118.84945, 0.5]]
      }
    },
    mounted() {
    },
    methods: {
      zoomUpdated (zoom) {
        this.zoom = zoom;
      },
      centerUpdated (center) {
        this.center = center;
      },
      boundsUpdated (bounds) {
        this.bounds = bounds;
      }
    }
  }
</script>

<style>

</style>
