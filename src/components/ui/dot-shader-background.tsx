"use client";

import { useMemo, useEffect, useRef } from "react";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, useTrailTexture } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

const defaultTrailTexture = (() => {
  const t = new THREE.DataTexture(new Uint8Array(4), 1, 1);
  t.needsUpdate = true;
  return t;
})();

const DotMaterialClass = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    dotColor: new THREE.Color("#FFFFFF"),
    bgColor: new THREE.Color("#121212"),
    mouseTrail: defaultTrailTexture,
    render: 0,
    rotation: 0,
    gridSize: 50,
    dotOpacity: 0.05,
  },
  /* glsl */ `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform int render;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform float rotation;
    uniform float gridSize;
    uniform float dotOpacity;

    vec2 rotate(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotationMatrix = mat2(c, -s, s, c);
        return rotationMatrix * (uv - 0.5) + 0.5;
    }

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 rotatedUv = rotate(uv, rotation);

      vec2 gridUv = fract(rotatedUv * gridSize);
      vec2 gridUvCenterInScreenCoords = rotate((floor(rotatedUv * gridSize) + 0.5) / gridSize, -rotation);

      float baseDot = sdfCircle(gridUv, 0.25);

      float screenMask = smoothstep(0.0, 1.0, 1.0 - uv.y);
      vec2 centerDisplace = vec2(0.7, 1.1);
      float circleMaskCenter = length(uv - centerDisplace);
      float circleMaskFromCenter = smoothstep(0.5, 1.0, circleMaskCenter);

      float combinedMask = screenMask * circleMaskFromCenter;
      float circleAnimatedMask = sin(time * 2.0 + circleMaskCenter * 10.0);

      float mouseInfluence = texture2D(mouseTrail, gridUvCenterInScreenCoords).r;

      float scaleInfluence = max(mouseInfluence * 0.5, circleAnimatedMask * 0.3);

      float dotSize = min(pow(circleMaskCenter, 2.0) * 0.3, 0.3);

      float sdfDot = sdfCircle(gridUv, dotSize * (1.0 + scaleInfluence * 0.5));

      float smoothDot = smoothstep(0.05, 0.0, sdfDot);

      float opacityInfluence = max(mouseInfluence * 50.0, circleAnimatedMask * 0.5);

      vec3 composition = mix(bgColor, dotColor, smoothDot * combinedMask * dotOpacity * (1.0 + opacityInfluence));

      gl_FragColor = vec4(composition, 1.0);
    }
  `
);

type DotMaterialInstance = InstanceType<typeof DotMaterialClass>;

function Scene() {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const { resolvedTheme } = useTheme();

  const rotation = 0;
  const gridSize = 100;

  const getThemeColors = () => {
    switch (resolvedTheme) {
      case "dark":
        return {
          dotColor: "#E4E4E7",
          bgColor: "#09090B",
          dotOpacity: 0.12,
        };
      case "light":
        return {
          dotColor: "#D4D4D8",
          bgColor: "#FFFFFF",
          dotOpacity: 0.22,
        };
      default:
        return {
          dotColor: "#D4D4D8",
          bgColor: "#FFFFFF",
          dotOpacity: 0.22,
        };
    }
  };

  const themeColors = getThemeColors();

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.1,
    maxAge: 400,
    interpolate: 1,
    ease: (x: number) =>
      x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
  });

  const materialRef = useRef<DotMaterialInstance>(null);

  useEffect(() => {
    if (!materialRef.current) return;
    const colors = getThemeColors();
    const m = materialRef.current;
    m.uniforms.dotColor.value.set(colors.dotColor);
    m.uniforms.bgColor.value.set(colors.bgColor);
    m.uniforms.dotOpacity.value = colors.dotOpacity;
  }, [resolvedTheme]);

  useFrame((state) => {
    if (!materialRef.current) return;
    const m = materialRef.current;
    m.uniforms.time.value = state.clock.elapsedTime;
    m.uniforms.resolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
    m.uniforms.rotation.value = rotation;
    m.uniforms.gridSize.value = gridSize;
    m.uniforms.mouseTrail.value = trail ?? defaultTrailTexture;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    onMove(e);
  };

  const scale = Math.max(viewport.width, viewport.height) / 2;

  const material = useMemo(() => new DotMaterialClass(), []);

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={handlePointerMove}>
      <planeGeometry args={[2, 2]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

export function DotScreenShader() {
  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
