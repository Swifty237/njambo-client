import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import userImages from './userImages';
import { EmptySeat } from './EmptySeat';

interface OccupiedSeatProps {
  seatNumber: string;
  hasTurn: boolean;
  turnStartTime?: number; // timestamp in ms when the turn started
}

const StyledOccupiedSeat = styled(EmptySeat)`
  position: relative;
  background-image: ${({ seatNumber }: OccupiedSeatProps) => `url(${userImages[parseInt(seatNumber)]})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 0;
  border: ${({ hasTurn }: OccupiedSeatProps) => (hasTurn ? `none` : `5px solid #6297b5`)};
  transition: all 0.3s;
  transform-origin: center center;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  &.hasTurn {
    animation: double-pulse 0.5s forwards;
  }

  .circle-timer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 130px;
    text-align: center;
    position: absolute;
    z-index: 4;
  }

  @keyframes double-pulse {
    0% {
      transform: scale(1);
    }

    25% {
      transform: scale(1.5);
    }

    50% {
      transform: scale(1);
    }

    75% {
      transform: scale(1.5);
    }

    100% {
      transform: scale(1.1);
    }
  }

  @media (max-width: 2000px) {
    width: 7vw;
    height: 7vw;
  }

  @media (max-width: 1350px) {
    width: 10vw;
    height: 10vw;
  }

  @media (max-width: 1000px) {
    width: 14vw;
    height: 14vw;
  }

  @media (max-width: 700px) {
    width: 18vw;
    height: 18vw;
  }
`;

const FULL_DURATION = 30000; // 30 seconds in ms

export const OccupiedSeat = ({ hasTurn, seatNumber, turnStartTime }: OccupiedSeatProps) => {
  const [elapsed, setElapsed] = useState(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!hasTurn || !turnStartTime) {
      setElapsed(0);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    const update = () => {
      const now = Date.now();
      const newElapsed = now - turnStartTime;
      if (newElapsed >= FULL_DURATION) {
        setElapsed(FULL_DURATION);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        return;
      }
      setElapsed(newElapsed);
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [hasTurn, turnStartTime]);

  // Calculate strokeDashoffset for SVG circle animation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Le cercle commence plein (offset = 0) et se vide progressivement
  const progress = Math.min(elapsed / FULL_DURATION, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <StyledOccupiedSeat
      hasTurn={hasTurn}
      seatNumber={seatNumber}
      className={hasTurn ? 'hasTurn' : ''}
    >
      {hasTurn && (
        <div className="circle-timer" aria-label="Turn timer">
          <svg
            width="130"
            height="130"
            viewBox="0 0 130 130"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Cercle de fond (gris) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="#E0E0E0"
              strokeWidth="10"
              fill="none"
            />
            {/* Cercle de progression (vert) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="#219653"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.1s linear',
                transformOrigin: 'center',
              }}
            />
          </svg>
        </div>
      )}
    </StyledOccupiedSeat>
  );
};
