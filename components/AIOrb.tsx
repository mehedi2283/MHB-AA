"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Core(){
  const ref=useRef<THREE.Group>(null);
  useFrame((state,delta)=>{if(!ref.current)return;ref.current.rotation.y+=delta*.12;ref.current.rotation.x=THREE.MathUtils.lerp(ref.current.rotation.x,state.pointer.y*.16,.04);ref.current.rotation.z=THREE.MathUtils.lerp(ref.current.rotation.z,-state.pointer.x*.12,.04)});
  const particles=useMemo(()=>{const a=new Float32Array(220*3);for(let i=0;i<a.length;i+=3){const n=i/3,r=2+((n*37)%101)/101*2.5,t=((n*53)%220)/220*Math.PI*2,p=Math.acos(2*((n*97)%223)/223-1);a[i]=r*Math.sin(p)*Math.cos(t);a[i+1]=r*Math.cos(p);a[i+2]=r*Math.sin(p)*Math.sin(t)}return a},[]);
  return <group ref={ref}>
    <Float speed={1.4} rotationIntensity={.25} floatIntensity={.35}>
      <Icosahedron args={[1.65,5]}><MeshDistortMaterial color="#214cc4" emissive="#2949a6" emissiveIntensity={1.2} roughness={.18} metalness={.78} distort={.22} speed={1.6}/></Icosahedron>
      <Icosahedron args={[1.86,2]}><meshBasicMaterial color="#7ca7ff" wireframe transparent opacity={.22}/></Icosahedron>
      <mesh><torusGeometry args={[2.25,.012,8,180]}/><meshBasicMaterial color="#8d70ff" transparent opacity={.7}/></mesh>
      <mesh rotation={[1.25,.3,.5]}><torusGeometry args={[2.55,.009,8,180]}/><meshBasicMaterial color="#5fc9ff" transparent opacity={.35}/></mesh>
    </Float>
    <Points positions={particles} stride={3}><PointMaterial transparent color="#88b6ff" size={.025} sizeAttenuation depthWrite={false}/></Points>
  </group>
}
export default function AIOrb(){return <div className="absolute inset-0" aria-hidden="true"><Canvas dpr={[1,1.5]} camera={{position:[0,0,7],fov:48}} gl={{antialias:true,alpha:true,powerPreference:"high-performance"}}><ambientLight intensity={.6}/><pointLight position={[4,3,5]} intensity={32} color="#6495ff"/><pointLight position={[-4,-2,2]} intensity={20} color="#9f68ff"/><Core/></Canvas></div>}
