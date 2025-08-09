import React from 'react';
import { animated, useSpring } from '@react-spring/web';

export interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  fromY?: number;
  delay?: number;
}

export const AnimatedDiv: React.FC<AnimatedDivProps> = ({ fromY = 12, delay = 0, style, children, ...rest }) => {
  const styles = useSpring({
    from: { opacity: 0, y: fromY },
    to: { opacity: 1, y: 0 },
    delay,
    config: { tension: 210, friction: 20 },
  });

  return (
    <animated.div
      style={{ opacity: styles.opacity, transform: styles.y.to((v) => `translateY(${v}px)`), ...style }}
      {...rest}
    >
      {children}
    </animated.div>
  );
};

export interface PressableProps extends React.HTMLAttributes<HTMLDivElement> {
  scaleDown?: number;
}

export const Pressable: React.FC<PressableProps> = ({ scaleDown = 0.97, style, children, ...rest }) => {
  const [pressStyles, pressApi] = useSpring(() => ({ scale: 1 }));

  const down = () => pressApi.start({ scale: scaleDown });
  const up = () => pressApi.start({ scale: 1 });

  return (
    <animated.div
      style={{ display: 'inline-block', transform: pressStyles.scale.to((s) => `scale(${s})`), ...style }}
      onMouseDown={(e) => { down(); rest.onMouseDown?.(e); }}
      onMouseUp={(e) => { up(); rest.onMouseUp?.(e); }}
      onMouseLeave={(e) => { up(); rest.onMouseLeave?.(e); }}
      onTouchStart={(e) => { down(); rest.onTouchStart?.(e); }}
      onTouchEnd={(e) => { up(); rest.onTouchEnd?.(e); }}
      {...rest}
    >
      {children}
    </animated.div>
  );
};

export default AnimatedDiv;
