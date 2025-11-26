# Soul Particles Enhancement 설계

## Overview

SoulParticles 컴포넌트에 마우스 인터랙션 기능을 추가하고, Stone Gate의 배경 투명도를 조정하여 입자 애니메이션의 몰입감과 시각적 깊이를 향상시킵니다.

## Architecture

### 현재 구조

```
src/
├── components/
│   └── animations/
│       └── SoulParticles.tsx  # Canvas 기반 파티클 시스템
├── app/
│   └── page.tsx               # 랜딩 페이지 (Stone Gate 포함)
```

### 수정 대상

1. **SoulParticles.tsx**: 마우스 인터랙션 로직 추가
2. **page.tsx**: Stone Gate 배경 투명도 조정

## Components and Interfaces

### Enhanced SoulParticles Component

#### Particle Interface (확장)

```typescript
interface Particle {
  x: number;           // 현재 X 좌표
  y: number;           // 현재 Y 좌표
  vx: number;          // X 방향 속도
  vy: number;          // Y 방향 속도
  size: number;        // 입자 크기
  opacity: number;     // 투명도
  baseVx: number;      // 기본 X 방향 속도 (새로 추가)
  baseVy: number;      // 기본 Y 방향 속도 (새로 추가)
}
```

#### Mouse Position Tracking

```typescript
interface MousePosition {
  x: number;
  y: number;
}
```

## Data Models

### Repulsion Physics

마우스 커서와 입자 간의 물리적 상호작용을 계산하는 모델:

```typescript
const REPULSION_RADIUS = 150;      // 영향 반경 (픽셀)
const REPULSION_STRENGTH = 0.5;    // 밀어내는 힘의 강도
const RETURN_SPEED = 0.05;         // 원래 속도로 돌아가는 속도
```

**계산 로직:**
1. 마우스와 입자 간의 거리 계산
2. 거리가 `REPULSION_RADIUS` 이내일 때 밀어내는 힘 적용
3. 거리에 반비례하는 힘 적용 (가까울수록 강함)
4. 마우스가 멀어지면 원래 속도로 부드럽게 복귀

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mouse repulsion effect

*For any* particle and mouse position, when the distance between them is less than REPULSION_RADIUS, the particle's velocity should be modified to move away from the mouse cursor.

**Validates: Requirements 1.1**

### Property 2: Velocity restoration

*For any* particle that was affected by mouse repulsion, when the mouse moves away beyond REPULSION_RADIUS, the particle's velocity should gradually return to its base velocity.

**Validates: Requirements 1.2**

### Property 3: Independent particle behavior

*For any* set of particles within the repulsion radius, each particle should calculate its repulsion vector independently based on its own position relative to the mouse.

**Validates: Requirements 1.4**

### Property 4: Background transparency preservation

*For any* Stone Gate background opacity value, the text content should remain readable while allowing particles to be visible behind it.

**Validates: Requirements 2.3**

### Property 5: Performance maintenance

*For any* number of particles being rendered with mouse interaction, the animation frame rate should remain at or above 60fps on desktop devices.

**Validates: Requirements 3.1**

## Error Handling

### Performance Degradation

- 입자 수를 화면 크기에 따라 동적으로 조정
- `requestAnimationFrame`을 사용하여 브라우저 최적화 활용
- 모바일 기기에서는 입자 수 감소

### Touch Events

- 마우스 이벤트와 터치 이벤트 모두 처리
- `touchmove` 이벤트를 `mousemove`와 동일하게 처리
- Passive event listener 사용으로 스크롤 성능 유지

### Edge Cases

- Canvas가 마운트되지 않은 경우 early return
- 윈도우 리사이즈 시 debounce 적용
- 컴포넌트 언마운트 시 이벤트 리스너 정리

## Testing Strategy

### Unit Tests

1. **Particle distance calculation**: 마우스와 입자 간 거리 계산이 정확한지 테스트
2. **Repulsion vector calculation**: 밀어내는 방향 벡터가 올바르게 계산되는지 테스트
3. **Velocity interpolation**: 속도가 부드럽게 복귀하는지 테스트

### Property-Based Tests

Property-based testing은 이 기능에서 선택적입니다. 시각적 애니메이션의 특성상 수동 테스트가 더 효과적일 수 있습니다.

### Manual Testing

1. **마우스 인터랙션**: 마우스를 움직여 입자들이 자연스럽게 피하는지 확인
2. **배경 투명도**: Stone Gate 뒤의 입자들이 보이는지, 텍스트 가독성은 유지되는지 확인
3. **성능**: 개발자 도구로 FPS 모니터링
4. **모바일**: 터치 이벤트가 정상 작동하는지 확인

## Implementation Details

### Mouse Tracking

```typescript
const [mousePos, setMousePos] = useState<MousePosition>({ x: -1000, y: -1000 });

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleTouchMove);
  };
}, []);
```

### Repulsion Logic

```typescript
particles.forEach((particle) => {
  const dx = particle.x - mousePos.x;
  const dy = particle.y - mousePos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < REPULSION_RADIUS && distance > 0) {
    // 정규화된 방향 벡터
    const nx = dx / distance;
    const ny = dy / distance;
    
    // 거리에 반비례하는 힘
    const force = (1 - distance / REPULSION_RADIUS) * REPULSION_STRENGTH;
    
    // 속도에 힘 적용
    particle.vx += nx * force;
    particle.vy += ny * force;
  } else {
    // 원래 속도로 복귀
    particle.vx += (particle.baseVx - particle.vx) * RETURN_SPEED;
    particle.vy += (particle.baseVy - particle.vy) * RETURN_SPEED;
  }
});
```

### Background Opacity Adjustment

현재: `bg-gradient-to-b from-stone-800/40 to-stone-900/60`

변경: `bg-gradient-to-b from-stone-800/20 to-stone-900/30`

투명도를 40/60에서 20/30으로 낮춰 입자들이 더 잘 보이도록 조정합니다.

## Performance Optimization

1. **Will-change CSS**: Canvas에 이미 적용됨
2. **Passive Event Listeners**: 스크롤 성능 향상
3. **RequestAnimationFrame**: 브라우저 최적화 활용
4. **Debounced Resize**: 리사이즈 이벤트 최적화
5. **Particle Count Limit**: 화면 크기에 따라 입자 수 제한
