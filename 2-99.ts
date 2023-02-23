const Primes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
  53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
]
/** 和分解唯一的和 及 能拆成两个质数之和的和 */
const SumExclusionSet = new Set(
  [2 + 2, 2 + 3, 98 + 99, 99 + 99].concat(Primes.map(n1 => Primes.map(n2 => n1 + n2)).flat()),
)

function solve() {
  // const pairsSet = new Set<[number, number]>()
  const sumSet = new Set<number>()
  for (let i = 2; i <= 99; i++) {
    for (let j = i; j <= 99; j++) {
      if (match1(i + j)) continue
      if (match2(i + j)) continue
      sumSet.add(i + j)
      // pairsSet.add([i, j])
    }
  }

  // for (const pair of pairsSet) {
  //   if (!match3(pair[0] * pair[1], sumSet)) {
  //     pairsSet.delete(pair)
  //   }
  // }

  const pairsList = Array.from(sumSet).map((s) => {
    const pairs: [number, number][] = []
    for (let i = 2; i <= s / 2; i++) {
      if (match3(i * (s - i), sumSet)) pairs.push([i, s - i])
    }
    return pairs
  })

  return pairsList.find(({ length }) => length === 1)?.[0]
}

/** 和分解唯一 或 能拆成两个质数之和 */
function match1(s: number) {
  return SumExclusionSet.has(s)
}

const match2Cache = new Map<number, boolean>()
/** 和的和分解中，存在组的积分解唯一 */
function match2(s: number) {
  if (match2Cache.has(s)) return match2Cache.get(s)

  let flag = false
  for (let i = 2; i <= s / 2; i++) {
    if (factorize(i * (s - i)).length === 1) {
      flag = true
      break
    }
  }
  match2Cache.set(s, flag)
  return flag
}

const factorizationCache = new Map<number, [number, number][]>()
/** 积分解 */
function factorize(p: number) {
  if (factorizationCache.has(p)) return factorizationCache.get(p)!

  const result: [number, number][] = []
  for (let i = 2; i <= Math.sqrt(p); i++) {
    const j = p / i
    if (Number.isInteger(j) && j <= 99) {
      result.push([i, j])
    }
  }
  factorizationCache.set(p, result)
  return result
}

/** 积的所有积分解，有且仅有一组的和在sumSet中 */
function match3(p: number, sumSet: Set<number>) {
  return factorize(p).filter(([i, j]) => sumSet.has(i + j)).length === 1
}

console.log(solve())
