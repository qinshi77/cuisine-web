<template>
  <div id="vr-container">
    <div ref="vrScene" class="vr-scene" />
    <div class="vr-controls">
      <button @click="startVR">开始VR体验</button>
      <button @click="resetScene">重置场景</button>
      <div class="info-panel">
        <h3>泉州非遗美食VR体验</h3>
        <p>使用鼠标或VR设备探索泉州传统美食文化</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

export default {
  name: 'VRView',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      isVRMode: false,
      foodModels: [],
      foodData: [
        {
          name: '泉州面线糊',
          description: '泉州传统小吃，以面线和海鲜熬制而成',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          color: 0xffcc00
        },
        {
          name: '土笋冻',
          description: '泉州特色小吃，以海蚯蚓为原料制作',
          position: [2, 0, 0],
          rotation: [0, Math.PI / 4, 0],
          color: 0xffffff
        },
        {
          name: '泉州烧肉粽',
          description: '泉州传统美食，以糯米、猪肉等食材制作',
          position: [-2, 0, 0],
          rotation: [0, -Math.PI / 4, 0],
          color: 0xff6600
        }
      ]
    }
  },
  mounted() {
    this.initScene()
    this.createFoodModels()
    this.animate()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    if (this.renderer) {
      this.renderer.dispose()
    }
  },
  methods: {
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xf0f0f0)

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      this.camera.position.z = 5

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.xr.enabled = true

      // 添加VR按钮
      document.body.appendChild(VRButton.createButton(this.renderer))

      // 添加到DOM
      this.$refs.vrScene.appendChild(this.renderer.domElement)

      // 添加轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      this.scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 1)
      this.scene.add(directionalLight)

      // 添加地面
      const groundGeometry = new THREE.PlaneGeometry(20, 20)
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -1
      this.scene.add(ground)

      // 响应窗口大小变化
      window.addEventListener('resize', this.onWindowResize)
    },
    createFoodModels() {
      // 为每种美食创建3D模型
      this.foodData.forEach((food, index) => {
        // 创建简单的几何体作为食物模型
        const geometry = new THREE.SphereGeometry(0.5, 32, 32)
        const material = new THREE.MeshStandardMaterial({ color: food.color })
        const foodMesh = new THREE.Mesh(geometry, material)

        // 设置位置和旋转
        foodMesh.position.set(...food.position)
        foodMesh.rotation.set(...food.rotation)

        // 添加到场景
        this.scene.add(foodMesh)
        this.foodModels.push(foodMesh)
      })
    },
    startVR() {
      this.isVRMode = true
      // 触发VR模式
      if (this.renderer.xr.isPresenting) {
        this.renderer.xr.getSession().end()
      } else {
        const session = this.renderer.xr.getSession()
        if (session) {
          session.requestAnimationFrame(() => {
            // VR模式已启动
          })
        }
      }
    },
    resetScene() {
      // 重置相机位置
      this.camera.position.set(0, 0, 5)
      this.controls.reset()
    },
    animate() {
      this.renderer.setAnimationLoop(() => {
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
      })
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }
}
</script>

<style scoped>
#vr-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.vr-scene {
  width: 100%;
  height: 100%;
}

.vr-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.vr-controls button {
  display: block;
  margin: 10px 0;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.vr-controls button:hover {
  background: #45a049;
}

.info-panel {
  margin-top: 20px;
}

.info-panel h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.info-panel p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>
