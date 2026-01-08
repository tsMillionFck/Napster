import { useRef, useEffect, useCallback } from "react";

export default function SparkCanvas({ onSpark }) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animationRef = useRef(null);

  const SPARK_COUNT = 8;
  const SPARK_SIZE = 15;
  const SPARK_RADIUS = 30;
  const DURATION = 500;
  const EXTRA_SCALE = 1.5;

  const easeOut = (t) => t * (2 - t);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Trigger freeze callback
      onSpark?.();

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();

      // Get orange color from CSS
      const color =
        getComputedStyle(document.body)
          .getPropertyValue("--color-swiss-orange")
          .trim() || "#ff5722";

      for (let i = 0; i < SPARK_COUNT; i++) {
        sparksRef.current.push({
          x,
          y,
          angle: (2 * Math.PI * i) / SPARK_COUNT,
          startTime: now,
          color,
        });
      }
    },
    [onSpark]
  );

  const draw = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= DURATION) return false;

      const progress = elapsed / DURATION;
      const eased = easeOut(progress);
      const distance = eased * SPARK_RADIUS * EXTRA_SCALE;
      const lineLength = SPARK_SIZE * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = spark.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("click", handleClick);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resizeCanvas, handleClick, draw]);

  return <canvas ref={canvasRef} id="spark-canvas" />;
}
