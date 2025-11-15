'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import GUI from 'lil-gui';

export default function GalacticPaper() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100,
        );
        camera.position.set(0, 2, 5);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Parameters
        const params = {
            alpha: 0.73,
            fresnelStrength: 1.0,
            waveAmplitude: 4.19,
            noiseScale: 0.11,
            colorDeep: '#0070ff',
            colorShallow: '#080040',
            textureInfluence: 0.5,
            bloomStrength: 0.5,
            bloomRadius: 0.4,
            bloomThreshold: 0.083,
            particleCount: 1000,
            particleSpeed: 0.5,
            particleSize: 5.0,
            particleOffsetY: 0.2,
        };

        // Post-processing
        let composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
        );
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;
        bloomPass.threshold = params.bloomThreshold;
        composer.addPass(bloomPass);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;

        // Water geometry
        const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
        geometry.rotateX(-Math.PI / 2);
        geometry.translate(0, 0.5, 0);

        // Texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            'https://images.pexels.com/photos/3871773/pexels-photo-3871773.jpeg?&w=1920&h=1920',
        );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);

        // Uniforms for water and particles
        const uniforms = {
            uTime: { value: 0.0 },
            uAlpha: { value: params.alpha },
            uFresnelStrength: { value: params.fresnelStrength },
            uWaveAmp: { value: params.waveAmplitude },
            uNoiseScale: { value: params.noiseScale },
            uColorDeep: { value: new THREE.Color(params.colorDeep) },
            uColorShallow: { value: new THREE.Color(params.colorShallow) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uTexture: { value: texture },
            uTextureInfluence: { value: params.textureInfluence },
            uParticleSize: { value: params.particleSize },
        };

        // Water vertex shader
        const vertexShader = `
      uniform float uTime;
      uniform float uWaveAmp;
      uniform float uNoiseScale;
      varying vec2 vUv;
      varying vec3 vPos;
      varying vec3 vNormal;
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }
      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      float noise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
      mat3 rotationMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(
          oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
          oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
          oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
        );
      }
      float fnoise(vec3 p) {
        mat3 rot = rotationMatrix(normalize(vec3(0.0, 0.0, 1.0)), 0.5 * uTime);
        mat3 rot2 = rotationMatrix(normalize(vec3(0.0, 0.0, 1.0)), 0.3 * uTime);
        float sum = 0.0;
        vec3 r = rot * p;
        float add = noise(r);
        float msc = add + 0.7;
        msc = clamp(msc, 0.0, 1.0);
        sum += 0.6 * add;
        p = p * 2.0;
        r = rot * p;
        add = noise(r);
        add *= msc;
        sum += 0.5 * add;
        msc *= add + 0.7;
        msc = clamp(msc, 0.0, 1.0);
        p.xy = p.xy * 2.0;
        p = rot2 * p;
        add = noise(p);
        add *= msc;
        sum += 0.25 * abs(add);
        msc *= add + 0.7;
        msc = clamp(msc, 0.0, 1.0);
        p = p * 2.0;
        add = noise(p);
        add *= msc;
        sum += 0.125 * abs(add);
        p = p * 2.0;
        add = noise(p);
        add *= msc;
        sum += 0.0625 * abs(add);
        return sum * 0.516129;
      }
      float getHeight(vec3 p) {
        return 0.3 - uWaveAmp * fnoise(vec3(uNoiseScale * (p.x + 0.0 * uTime), uNoiseScale * p.z, 0.4 * uTime));
      }
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y = getHeight(pos);
        vPos = pos;
        vec3 pdx = pos + vec3(0.01, 0.0, 0.0);
        vec3 pdz = pos + vec3(0.0, 0.0, 0.01);
        float hdx = getHeight(pdx);
        float hdz = getHeight(pdz);
        pdx.y = hdx;
        pdz.y = hdz;
        vNormal = normalize(cross(pos - pdz, pos - pdx));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

        // Water fragment shader
        const fragmentShader = `
      uniform float uTime;
      uniform float uAlpha;
      uniform float uFresnelStrength;
      uniform float uWaveAmp;
      uniform float uNoiseScale;
      uniform vec3 uColorDeep;
      uniform vec3 uColorShallow;
      uniform vec2 uResolution;
      uniform sampler2D uTexture;
      uniform float uTextureInfluence;
      varying vec2 vUv;
      varying vec3 vPos;
      varying vec3 vNormal;
      vec4 getSky(vec3 rd) {
        if (rd.y > 0.3) return vec4(0.5, 0.8, 1.5, 1.0);
        if (rd.y < 0.0) return vec4(0.0, 0.2, 0.4, 1.0);
        if (rd.z > 0.9 && rd.x > 0.3) {
          if (rd.y > 0.2) return 1.5 * vec4(2.0, 1.0, 1.0, 1.0);
          return 1.5 * vec4(2.0, 1.0, 0.5, 1.0);
        }
        return vec4(0.5, 0.8, 1.5, 1.0);
      }
      vec4 shade(vec3 normal, vec3 pos, vec3 rd) {
        float fresnel = uFresnelStrength * pow(1.0 - clamp(dot(-rd, normal), 0.0, 1.0), 5.0) + (1.0 - uFresnelStrength);
        vec3 refVec = reflect(rd, normal);
        vec4 reflection = getSky(refVec);
        float deep = 1.0 + 0.5 * pos.y;
        vec4 col = fresnel * reflection;
        col += deep * 0.4 * vec4(uColorDeep, 1.0);
        col = mix(col, vec4(uColorShallow, 1.0), clamp(pos.y * 2.0 + 0.5, 0.0, 1.0));
        vec4 textureColor = texture2D(uTexture, vUv);
        col = mix(col, textureColor, uTextureInfluence);
        return clamp(col, 0.0, 1.0);
      }
      void main() {
        vec3 ro = cameraPosition;
        vec3 rd = normalize(vPos - ro);
        vec4 col = shade(vNormal, vPos, rd);
        gl_FragColor = vec4(col.rgb, uAlpha);
      }
    `;

        // Water material
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false,
        });

        const waterSurface = new THREE.Mesh(geometry, material);
        scene.add(waterSurface);

        // Particle system
        let particleCount = params.particleCount;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const uvs = new Float32Array(particleCount * 2);
        const velocities = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);
        const offsetYs = new Float32Array(particleCount);

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const i2 = i * 2;
            const x = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            const y = 0;
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            uvs[i2] = (x + 5) / 10;
            uvs[i2 + 1] = (z + 5) / 10;
            velocities[i3] = 0;
            velocities[i3 + 1] = params.particleSpeed * (0.5 + Math.random());
            velocities[i3 + 2] = 0;
            lifetimes[i] = Math.random() * 5;
            offsetYs[i] = Math.random() * params.particleOffsetY;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        particleGeometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
        particleGeometry.setAttribute('offsetY', new THREE.BufferAttribute(offsetYs, 1));

        // Particle vertex shader
        const particleVertexShader = `
      uniform float uTime;
      uniform float uWaveAmp;
      uniform float uNoiseScale;
      uniform float uParticleSize;
      attribute vec3 velocity;
      attribute float lifetime;
      attribute float offsetY;
      varying vec2 vUv;
      varying vec3 vPos;
      varying float vLifetime;
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }
      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      float noise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
      mat3 rotationMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(
          oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
          oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
          oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
        );
      }
      float fnoise(vec3 p) {
        mat3 rot = rotationMatrix(normalize(vec3(0.0, 0.0, 1.0)), 0.5 * uTime);
        mat3 rot2 = rotationMatrix(normalize(vec3(0.0, 0.0, 1.0)), 0.3 * uTime);
        float sum = 0.0;
        vec3 r = rot * p;
        float add = noise(r);
        float msc = add + 0.7;
        msc = clamp(msc, 0.0, 1.0);
        sum += 0.6 * add;
        p = p * 2.0;
        r = rot * p;
        add = noise(r);
        add *= msc;
        sum += 0.5 * add;
        msc *= add + 0.7;
        msc = clamp(msc, 0.0, 1.0);
        p.xy = p.xy * 2.0;
        p = rot2 * p;
        add = noise(p);
        add *= msc;
        sum += 0.25 * abs(add);
        msc *= add + 0.7;
        msc = clamp(msc, 0.0, 1.0);
        p = p * 2.0;
        add = noise(p);
        add *= msc;
        sum += 0.125 * abs(add);
        p = p * 2.0;
        add = noise(p);
        add *= msc;
        sum += 0.0625 * abs(add);
        return sum * 0.516129;
      }
      float getHeight(vec3 p) {
        return 0.3 - uWaveAmp * fnoise(vec3(uNoiseScale * (p.x + 0.0 * uTime), uNoiseScale * p.z, 0.4 * uTime));
      }
      void main() {
        vUv = uv;
        vLifetime = lifetime - uTime;
        vec3 pos = position;
        float baseHeight = getHeight(vec3(position.x, 0.0, position.z));
        pos.y = baseHeight + offsetY + velocity.y * (uTime - (lifetime - vLifetime));
        if (vLifetime < 0.0) {
          pos.y = getHeight(vec3(position.x, 0.0, position.z)) + offsetY;
          vLifetime = 5.0;
        }
        vPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = uParticleSize * (vLifetime / 5.0);
      }
    `;

        // Particle fragment shader
        const particleFragmentShader = `
      uniform float uTime;
      uniform float uAlpha;
      uniform float uFresnelStrength;
      uniform vec3 uColorDeep;
      uniform vec3 uColorShallow;
      uniform sampler2D uTexture;
      uniform float uTextureInfluence;
      varying vec2 vUv;
      varying vec3 vPos;
      varying float vLifetime;
      vec4 getSky(vec3 rd) {
        if (rd.y > 0.3) return vec4(0.5, 0.8, 1.5, 1.0);
        if (rd.y < 0.0) return vec4(0.0, 0.2, 0.4, 1.0);
        if (rd.z > 0.9 && rd.x > 0.3) {
          if (rd.y > 0.2) return 1.5 * vec4(2.0, 1.0, 1.0, 1.0);
          return 1.5 * vec4(2.0, 1.0, 0.5, 1.0);
        }
        return vec4(0.5, 0.8, 1.5, 1.0);
      }
      void main() {
        vec3 ro = cameraPosition;
        vec3 rd = normalize(vPos - ro);
        vec3 normal = vec3(0.0, 1.0, 0.0);
        float fresnel = uFresnelStrength * pow(1.0 - clamp(dot(-rd, normal), 0.0, 1.0), 5.0) + (1.0 - uFresnelStrength);
        vec3 refVec = reflect(rd, normal);
        vec4 reflection = getSky(refVec);
        float deep = 1.0 + 0.5 * vPos.y;
        vec4 col = fresnel * reflection;
        col += deep * 0.4 * vec4(uColorDeep, 1.0);
        col = mix(col, vec4(uColorShallow, 1.0), clamp(vPos.y * 2.0 + 0.5, 0.0, 1.0));
        vec4 textureColor = texture2D(uTexture, vUv);
        col = mix(col, textureColor, uTextureInfluence);
        col = clamp(col, 0.0, 1.0);
        float alpha = uAlpha * (vLifetime / 5.0);
        gl_FragColor = vec4(col.rgb, alpha);
      }
    `;

        const particleMaterial = new THREE.ShaderMaterial({
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            uniforms: uniforms,
            transparent: true,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        // GUI
        const gui = new GUI();
        gui.close();
        const waterFolder = gui.addFolder('Water');
        waterFolder.add(params, 'alpha', 0.0, 1.0).onChange((v) => (uniforms.uAlpha.value = v));
        waterFolder
            .add(params, 'fresnelStrength', 0.0, 1.0)
            .onChange((v) => (uniforms.uFresnelStrength.value = v));
        waterFolder
            .add(params, 'waveAmplitude', 0.0, 8.0)
            .onChange((v) => (uniforms.uWaveAmp.value = v));
        waterFolder
            .add(params, 'noiseScale', 0.1, 2.0)
            .onChange((v) => (uniforms.uNoiseScale.value = v));
        waterFolder.addColor(params, 'colorDeep').onChange((v) => uniforms.uColorDeep.value.set(v));
        waterFolder
            .addColor(params, 'colorShallow')
            .onChange((v) => uniforms.uColorShallow.value.set(v));
        waterFolder
            .add(params, 'textureInfluence', 0.0, 1.0)
            .onChange((v) => (uniforms.uTextureInfluence.value = v));

        const particleFolder = gui.addFolder('Particles');
        particleFolder.add(params, 'particleCount', 100, 50000, 1).onChange((v) => {
            scene.remove(particles);
            const newParticleCount = Math.floor(v);
            particleCount = newParticleCount;
            const newPositions = new Float32Array(newParticleCount * 3);
            const newUvs = new Float32Array(newParticleCount * 2);
            const newVelocities = new Float32Array(newParticleCount * 3);
            const newLifetimes = new Float32Array(newParticleCount);
            const newOffsetYs = new Float32Array(newParticleCount);
            for (let i = 0; i < newParticleCount; i++) {
                const i3 = i * 3;
                const i2 = i * 2;
                const x = (Math.random() - 0.5) * 10;
                const z = (Math.random() - 0.5) * 10;
                const y = 0;
                newPositions[i3] = x;
                newPositions[i3 + 1] = y;
                newPositions[i3 + 2] = z;
                newUvs[i2] = (x + 5) / 10;
                newUvs[i2 + 1] = (z + 5) / 10;
                newVelocities[i3] = 0;
                newVelocities[i3 + 1] = params.particleSpeed * (0.5 + Math.random());
                newVelocities[i3 + 2] = 0;
                newLifetimes[i] = Math.random() * 5;
                newOffsetYs[i] = Math.random() * params.particleOffsetY;
            }
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
            particleGeometry.setAttribute('uv', new THREE.BufferAttribute(newUvs, 2));
            particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(newVelocities, 3));
            particleGeometry.setAttribute('lifetime', new THREE.BufferAttribute(newLifetimes, 1));
            particleGeometry.setAttribute('offsetY', new THREE.BufferAttribute(newOffsetYs, 1));
            particles.geometry = particleGeometry;
            scene.add(particles);
        });
        particleFolder.add(params, 'particleSpeed', 0.1, 2.0).onChange((v) => {
            const velocities = particleGeometry.attributes.velocity.array;
            for (let i = 0; i < particleCount; i++) {
                velocities[i * 3 + 1] = v * (0.5 + Math.random());
            }
            particleGeometry.attributes.velocity.needsUpdate = true;
        });
        particleFolder.add(params, 'particleOffsetY', 0.0, 100.0).onChange((v) => {
            const offsetYs = particleGeometry.attributes.offsetY.array;
            for (let i = 0; i < particleCount; i++) {
                offsetYs[i] = Math.random() * v;
            }
            particleGeometry.attributes.offsetY.needsUpdate = true;
        });
        particleFolder
            .add(params, 'particleSize', 2.0, 100.0)
            .name('Particle Size')
            .onChange((v) => {
                uniforms.uParticleSize.value = v;
            });

        const bloomFolder = gui.addFolder('Bloom');
        bloomFolder
            .add(params, 'bloomStrength', 0.0, 3.0)
            .onChange((v) => (bloomPass.strength = v));
        bloomFolder.add(params, 'bloomRadius', 0.0, 1.0).onChange((v) => (bloomPass.radius = v));
        bloomFolder
            .add(params, 'bloomThreshold', 0.0, 1.0)
            .onChange((v) => (bloomPass.threshold = v));

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            uniforms.uTime.value = performance.now() / 1000;
            const lifetimes = particleGeometry.attributes.lifetime.array;
            for (let i = 0; i < particleCount; i++) {
                lifetimes[i] -= 1 / 60;
                if (lifetimes[i] < 0) {
                    lifetimes[i] = 5.0;
                }
            }
            particleGeometry.attributes.lifetime.needsUpdate = true;
            controls.update();
            composer.render();
        }
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            gui.destroy();
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            texture.dispose();
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100vw',
                height: '100vh',
                margin: 0,
                overflow: 'hidden',
                zIndex: 0,
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        />
    );
}
