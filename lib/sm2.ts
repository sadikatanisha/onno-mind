export function updateSm2({
  quality,
  prevEase,
  prevInterval,
  prevReps,
}: {
  quality: 0 | 1 | 2 | 3 | 4 | 5
  prevEase: number
  prevInterval: number
  prevReps: number
}) {
  let ease = prevEase
  let interval = prevInterval
  let reps = prevReps

  if (quality >= 3) {
    reps += 1
    if (reps === 1) {
      interval = 1
    } else if (reps === 2) {
      interval = 6
    } else {
      interval = Math.round(prevInterval * ease)
    }
    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  } else {
    reps = 0
    interval = 1
  }

  ease = Math.max(1.3, ease)
  const nextDue = new Date(Date.now() + interval * 24 * 60 * 60 * 1000)

  return { ease, interval, reps, nextDue }
}


