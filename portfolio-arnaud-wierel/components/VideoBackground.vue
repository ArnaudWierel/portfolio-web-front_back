<template>
    <div class="video-background" ref="videoBg">
        <video autoplay muted loop playsinline ref="video">
            <source src="~/assets/video/background.webm" type="video/webm">
            Your browser does not support the video tag.
        </video>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const videoBg = ref(null);
const video = ref(null);

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation d'entrée de la vidéo
    gsap.fromTo(videoBg.value, 
        { opacity: 0 }, 
        {
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            onStart: () => {
                videoBg.value.style.visibility = 'visible';
            },
            scrollTrigger: {
                trigger: videoBg.value,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
            }
        }
    );

    // Sur le scroll de la page, on réduit l'opacité de la vidéo
    window.addEventListener('scroll', () => {
        const newOpacity = 1 - window.scrollY / 800;
        videoBg.value.style.opacity = newOpacity;
    });
});
</script>

<style scoped>

.video-background {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100vw;
    min-height: 100vh;
    z-index: -1;
    visibility: hidden;
}

video {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
}
</style>
