<template>
    <div>
        <div id="container"></div>
    </div>
</template>

<script>

    import * as Three from 'three'

    export default {
        name: "ColumConfig",
        components:{
        },
        data(){
            return{
                camera: null,
                scene: null,
                renderer: null,
                mesh: null
            }
        },
        methods: {
            init: function() {
                let container = document.getElementById('container');
                //1.Camera
                this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
                this.camera.position.z = 1;
                //2.Scene
                this.scene = new Three.Scene();
                //3.geometry and material mesh
                let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
                let material = new Three.MeshNormalMaterial();
                //4.mesh add into scene
                this.mesh = new Three.Mesh(geometry, material);
                this.scene.add(this.mesh);
                //5.all render
                this.renderer = new Three.WebGLRenderer({antialias: true});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(this.renderer.domElement);

            },
            animate: function() {
                requestAnimationFrame(this.animate);
                this.mesh.rotation.x += 0.01;
                this.mesh.rotation.y += 0.02;
                this.renderer.render(this.scene, this.camera);
            }
        },
        mounted() {
            this.init();
            this.animate()
        },
        created() {

        }
    }
</script>

<style scoped>
    #container {
        height: 400px;
    }
</style>