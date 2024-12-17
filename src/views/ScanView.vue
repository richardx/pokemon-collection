<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900"
  >
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
      Scan QR Code
    </h1>
    <video ref="video" class="w-1/2" autoplay></video>
    <canvas ref="canvas" class="hidden"></canvas>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <p v-if="result" class="text-green-500 mt-4">Result: {{ result }}</p>
  </div>
</template>

<script>
  import jsQR from 'jsqr';

  export default {
    name: 'ScanView',
    data() {
      return {
        error: '',
        result: '',
      };
    },
    mounted() {
      this.startCamera();
    },
    methods: {
      async startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          this.$refs.video.srcObject = stream;
          this.$refs.video.setAttribute('playsinline', true); // Required for iOS
          this.$refs.video.play();
          requestAnimationFrame(this.scan);
        } catch (err) {
          this.error =
            'Unable to access the camera. Please check your permissions.';
          console.error(err);
        }
      },
      scan() {
        const video = this.$refs.video;
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            this.result = code.data;
            this.stopCamera();
          }
        }
        requestAnimationFrame(this.scan);
      },
      stopCamera() {
        const stream = this.$refs.video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        this.$refs.video.srcObject = null;
      },
    },
  };
</script>
