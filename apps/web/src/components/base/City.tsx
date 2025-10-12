'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface City3DProps {
    className?: string;
}

export default function City3D({ className = '' }: City3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (window.innerWidth > 800) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
        }

        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const camera = new THREE.PerspectiveCamera(
            20,
            window.innerWidth / window.innerHeight,
            1,
            500,
        );
        camera.position.set(0, 2, 14);

        const scene = new THREE.Scene();
        const city = new THREE.Object3D();
        const smoke = new THREE.Object3D();
        const town = new THREE.Object3D();

        let createCarPos = true;
        const uSpeed = 0.001;

        // FOG background
        const setcolor = 0x6c44fc;
        scene.background = new THREE.Color(setcolor);
        scene.fog = new THREE.Fog(setcolor, 10, 16);

        // RANDOM Function
        function mathRandom(num = 8) {
            const numValue = -Math.random() * num + Math.random() * num;
            return numValue;
        }

        // CHANGE building colors
        let setTintNum = true;
        function setTintColor() {
            let setColor = 0x000000;
            if (setTintNum) {
                setTintNum = false;
                setColor = 0x000000;
            } else {
                setTintNum = true;
                setColor = 0x000000;
            }
            return setColor;
        }

        // CREATE City
        function init() {
            const segments = 2;
            for (let i = 1; i < 100; i++) {
                const geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);
                const material = new THREE.MeshStandardMaterial({
                    color: setTintColor(),
                    wireframe: false,
                    side: THREE.DoubleSide,
                });
                const wmaterial = new THREE.MeshLambertMaterial({
                    color: 0xffffff,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.03,
                    side: THREE.DoubleSide,
                });

                const cube = new THREE.Mesh(geometry, material);
                const wfloor = new THREE.Mesh(geometry, wmaterial);
                const floor = new THREE.Mesh(geometry, material);

                cube.add(wfloor);
                cube.castShadow = true;
                cube.receiveShadow = true;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                cube.rotationValue = 0.1 + Math.abs(mathRandom(8));

                floor.scale.y = 0.05;
                cube.scale.y = 0.1 + Math.abs(mathRandom(8));

                const cubeWidth = 0.9;
                cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
                cube.position.x = Math.round(mathRandom());
                cube.position.z = Math.round(mathRandom());

                floor.position.set(cube.position.x, 0, cube.position.z);

                town.add(floor);
                town.add(cube);
            }

            // Particles
            const gmaterial = new THREE.MeshToonMaterial({
                color: 0xffff00,
                side: THREE.DoubleSide,
            });
            const gparticular = new THREE.CircleGeometry(0.01, 3);
            const aparticular = 5;

            for (let h = 1; h < 300; h++) {
                const particular = new THREE.Mesh(gparticular, gmaterial);
                particular.position.set(
                    mathRandom(aparticular),
                    mathRandom(aparticular),
                    mathRandom(aparticular),
                );
                particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
                smoke.add(particular);
            }

            // Ground plane
            const pmaterial = new THREE.MeshPhongMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
                opacity: 0.9,
                transparent: true,
            });
            const pgeometry = new THREE.PlaneGeometry(60, 60);
            const pelement = new THREE.Mesh(pgeometry, pmaterial);
            pelement.rotation.x = (-90 * Math.PI) / 180;
            pelement.position.y = -0.001;
            pelement.receiveShadow = true;

            city.add(pelement);
        }

        // MOUSE function
        const mouse = { x: 0, y: 0 };

        function onMouseMove(event: MouseEvent) {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        function onDocumentTouchStart(event: TouchEvent) {
            if (event.touches.length === 1) {
                event.preventDefault();
                mouse.x = event.touches[0].pageX - window.innerWidth / 2;
                mouse.y = event.touches[0].pageY - window.innerHeight / 2;
            }
        }

        function onDocumentTouchMove(event: TouchEvent) {
            if (event.touches.length === 1) {
                event.preventDefault();
                mouse.x = event.touches[0].pageX - window.innerWidth / 2;
                mouse.y = event.touches[0].pageY - window.innerHeight / 2;
            }
        }

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        const lightFront = new THREE.SpotLight(0xffffff, 20, 10);
        const lightBack = new THREE.PointLight(0xffffff, 0.5);

        lightFront.rotation.x = (45 * Math.PI) / 180;
        lightFront.rotation.z = (-45 * Math.PI) / 180;
        lightFront.position.set(5, 5, 5);
        lightFront.castShadow = true;
        lightFront.shadow.mapSize.width = 6000;
        lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
        lightFront.penumbra = 0.1;
        lightBack.position.set(0, 6, 0);

        smoke.position.y = 2;

        scene.add(ambientLight);
        city.add(lightFront);
        scene.add(lightBack);
        scene.add(city);
        city.add(smoke);
        city.add(town);

        // GRID Helper
        const gridHelper = new THREE.GridHelper(60, 120, 0xff0000, 0x000000);
        city.add(gridHelper);

        // LINES world - Create cars
        const createCars = function (cScale = 2, cPos = 20, cColor = 0xffff00) {
            const cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
            const cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
            const cElem = new THREE.Mesh(cGeo, cMat);
            const cAmp = 3;

            if (createCarPos) {
                createCarPos = false;
                cElem.position.x = -cPos;
                cElem.position.z = mathRandom(cAmp);
            } else {
                createCarPos = true;
                cElem.position.x = mathRandom(cAmp);
                cElem.position.z = -cPos;
                cElem.rotation.y = (90 * Math.PI) / 180;
            }

            cElem.receiveShadow = true;
            cElem.castShadow = true;
            cElem.position.y = Math.abs(mathRandom(5));
            city.add(cElem);
        };

        const generateLines = function () {
            for (let i = 0; i < 60; i++) {
                createCars(0.1, 20);
            }
        };

        // Window resize handler
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // ANIMATE
        const animate = function () {
            animationFrameRef.current = requestAnimationFrame(animate);

            city.rotation.y -= (mouse.x * 8 - camera.rotation.y) * uSpeed;
            city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;

            if (city.rotation.x < -0.05) city.rotation.x = -0.05;
            else if (city.rotation.x > 1) city.rotation.x = 1;

            smoke.rotation.y += 0.01;
            smoke.rotation.x += 0.01;

            camera.lookAt(city.position);
            renderer.render(scene, camera);
        };

        // START functions
        generateLines();
        init();
        animate();

        // Event listeners
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchstart', onDocumentTouchStart);
        window.addEventListener('touchmove', onDocumentTouchMove);

        // Cleanup
        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchstart', onDocumentTouchStart);
            window.removeEventListener('touchmove', onDocumentTouchMove);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (rendererRef.current && containerRef!.current) {
                containerRef!.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }

            // Clean up geometries and materials
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        };
    }, []);

    return <div ref={containerRef} className={`fixed inset-0 ${className}`} />;
}
