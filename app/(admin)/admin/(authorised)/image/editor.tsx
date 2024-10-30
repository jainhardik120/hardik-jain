"use client";

import Konva from 'konva';
import React, { useState } from 'react';
import { Stage, Layer, Star, Rect } from 'react-konva';

const Editor = () => {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [scale, setScale] = useState(1);

  function generateShapes() {
    return [...Array(10)].map((_, i) => ({
      id: i.toString(),
      x: Math.random() * width, // Adjust to use width
      y: Math.random() * height, // Adjust to use height
      rotation: Math.random() * 180,
      isDragging: false,
    }));
  }

  const [stars, setStars] = React.useState(generateShapes());

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    setStars(
      stars.map((star) => ({
        ...star,
        isDragging: star.id === id,
      }))
    );
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setStars(
      stars.map((star) => ({
        ...star,
        isDragging: false,
      }))
    );
  };

  return (
    <div className="w-full flex h-[80vh]">
      <div className='w-[320px] bg-red-400'></div>
      <div className='flex-1 overflow-auto'>
        <Stage width={width * scale} height={height*scale} scale={{ x: scale, y: scale }}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="white"
            />
            {stars.map((star) => (
              <Star
                key={star.id}
                id={star.id}
                x={star.x}
                y={star.y}
                numPoints={5}
                innerRadius={20}
                outerRadius={40}
                fill="#89b717"
                opacity={0.8}
                draggable
                rotation={star.rotation}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div className='w-[320px] bg-green-400 flex flex-col'>
        Width : <input type="number" value={width} onChange={(e) => {
          const newWidth = parseInt(e.target.value, 10);
          setWidth(newWidth);
        }} />
        Height : <input type="number" value={height} onChange={(e) => {
          const newHeight = parseInt(e.target.value, 10);
          setHeight(newHeight);
        }} />
        Scale : <input type="number" value={scale} onChange={(e) => {
          const newScale = parseFloat(e.target.value);
          setScale(newScale);
        }} />
      </div>
    </div>
  );
}

export default Editor;
