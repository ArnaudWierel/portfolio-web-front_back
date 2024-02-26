<template>
<div class="menu">
    <Icon name="line-md:menu-to-close-alt-transition" size="50" @click="toggleMenu"/>
    <div class="message">
        <h1>Menu</h1>
        <p>Click on the links to navigate</p>
    </div>
</div>
</template>

<script>
export default {
    methods: {
        toggleMenu() {
            this.$router.push('/');
        },
    },
};
</script>