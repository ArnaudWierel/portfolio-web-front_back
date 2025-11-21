<template>
    <div class="video-background" :class="wrapperClass" ref="videoBg">
        <video autoplay muted loop playsinline ref="video">
            <source src="~/assets/video/background.webm" type="video/webm">
            Your browser does not support the video tag.
        </video>
    </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const props = defineProps({
    scoped: {
        type: Boolean,
        default: false
    }
});

const videoBg = ref(null);
const video = ref(null);
const scrollListener = () => {
    if (props.scoped) return;
    if (!videoBg.value) return;
    const progress = Math.min(Math.max(window.scrollY / 600, 0), 1);
    const opacity = 1 - progress;
    videoBg.value.style.opacity = opacity.toFixed(2);
    videoBg.value.style.visibility = opacity <= 0.05 ? 'hidden' : 'visible';
};

const wrapperClass = computed(() => ({
    'video-background--scoped': props.scoped
}));

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
    if (!props.scoped) {
        window.addEventListener('scroll', scrollListener, { passive: true });
        scrollListener();
    } else if (videoBg.value) {
        videoBg.value.style.opacity = 1;
        videoBg.value.style.visibility = 'visible';
    }
});

onBeforeUnmount(() => {
    if (!props.scoped) {
        window.removeEventListener('scroll', scrollListener);
    }
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

.video-background--scoped {
    position: absolute;
    inset: 0;
    min-width: 100%;
    min-height: 100%;
    z-index: 0;
}

.video-background--scoped video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
