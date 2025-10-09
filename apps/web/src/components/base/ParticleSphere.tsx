"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

type Particle = {
    position: [number, number, number]
    scale: number
    color: THREE.Color
    rotationSpeed: number
}

type OrbitingImage = {
    position: [number, number, number]
    rotation: [number, number, number]
    textureIndex: number
    color: THREE.Color
}

export function ParticleSphere() {
    const PARTICLE_COUNT = 1500
    const PARTICLE_SIZE_MIN = 0.005
    const PARTICLE_SIZE_MAX = 0.010
    const SPHERE_RADIUS = 9
    const POSITION_RANDOMNESS = 4
    const ROTATION_SPEED_X = 0.0
    const ROTATION_SPEED_Y = 0.0005
    const PARTICLE_OPACITY = 1

    const IMAGE_COUNT = 24
    const IMAGE_SIZE = 1.5

    const groupRef = useRef<THREE.Group>(null)

    const textures = useTexture([
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=256&q=80",
    ])



    useMemo(() => {
        textures.forEach((texture) => {
            if (texture) {
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                texture.flipY = false
            }
        })
    }, [textures])

    const particles: Particle[] = useMemo(() => {
        const particles: Particle[] = []

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi

            const radiusVariation =
                SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS

            const x = radiusVariation * Math.cos(theta) * Math.sin(phi)
            const y = radiusVariation * Math.cos(phi)
            const z = radiusVariation * Math.sin(theta) * Math.sin(phi)

            particles.push({
                position: [x, y, z],
                scale:
                    Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) +
                    PARTICLE_SIZE_MIN,
                color: new THREE.Color().setHSL(
                    Math.random() * 0.1 + 0.05,
                    0.8,
                    0.6 + Math.random() * 0.3
                ),
                rotationSpeed: (Math.random() - 0.5) * 0.01,
            })
        }

        return particles
    }, [PARTICLE_COUNT, SPHERE_RADIUS, POSITION_RANDOMNESS, PARTICLE_SIZE_MIN, PARTICLE_SIZE_MAX])

    const orbitingImages: OrbitingImage[] = useMemo(() => {
        const images: OrbitingImage[] = []

        for (let i = 0; i < IMAGE_COUNT; i++) {
            const angle = (i / IMAGE_COUNT) * Math.PI * 2
            const x = SPHERE_RADIUS * Math.cos(angle)
            const y = 0
            const z = SPHERE_RADIUS * Math.sin(angle)

            const positionVec = new THREE.Vector3(x, y, z)
            const center = new THREE.Vector3(0, 0, 0)
            const outwardDirection = positionVec.clone().sub(center).normalize()

            const euler = new THREE.Euler()
            const matrix = new THREE.Matrix4()
            matrix.lookAt(positionVec, positionVec.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0))
            euler.setFromRotationMatrix(matrix)
            euler.z += Math.PI

            images.push({
                position: [x, y, z],
                rotation: [euler.x, euler.y, euler.z],
                textureIndex: i % textures.length,
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
            })
        }

        return images
    }, [IMAGE_COUNT, SPHERE_RADIUS, textures.length])

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += ROTATION_SPEED_Y
            groupRef.current.rotation.x += ROTATION_SPEED_X
        }
    })

    return (
        <group ref={groupRef}>
            {particles.map((particle, index) => (
                <mesh key={index} position={particle.position} scale={particle.scale}>
                    <sphereGeometry args={[1, 8, 6]} />
                    <meshBasicMaterial
                        color={particle.color}
                        transparent
                        opacity={PARTICLE_OPACITY}
                    />
                </mesh>
            ))}

            {orbitingImages.map((image, index) => (
                <mesh
                    key={`image-${index}`}
                    position={image.position}
                    rotation={image.rotation}
                >
                    <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
                    <meshBasicMaterial
                        map={textures[image.textureIndex]}
                        opacity={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    )
}
