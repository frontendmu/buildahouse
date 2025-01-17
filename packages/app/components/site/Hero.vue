<template>
    <div class="grid-cols-1 grid-rows-1 grid gap-4 place-items-center h-screen bg-slate-100 hero-section">
        <ClientOnly>
            <InspiraTetris
                class="hero-background h-screen fixed z-0 w-full [mask-image:radial-gradient(80vh_circle_at_center,#00C16A,transparent)] lg:[mask-image:radial-gradient(50vw_circle_at_center,#00C16A,transparent)]"
                :base="25" square-color="#4A6DE5" />
        </ClientOnly>
        <div class="text-center text-neutral-800 z-10 relative flex flex-col gap-4 hero-text">
            <h1 class="text-4xl md:text-6xl font-bold ">build a house</h1>
            <p class="text-lg ">A community project to guide young Mauritians build their home</p>
            <div>
                <InspiraRainbowButton>
                    Get started
                    <Icon name="carbon:arrow-right" />
                </InspiraRainbowButton>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
h1 {
    font-family: "Electrolize", sans-serif;
}

.hero-section {
    grid-template-areas: "cell";
}

.hero-background {
    grid-area: cell;
}

.hero-text {
    grid-area: cell;
    z-index: 10;
    opacity: 0;
    animation: fadeIn 0.4s ease-out 1s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        top: -20px;
    }

    to {
        top: 0px;
        opacity: 1;
    }
}
</style>