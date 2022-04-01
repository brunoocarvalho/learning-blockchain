import { BinaryLike, createHash } from "crypto";

export function hash(payload: BinaryLike) {
  return createHash('sha256').update(payload).digest('hex')
}

export function validatedHash({ hash, difficult = 4, prefix = '0' }: {hash: string, difficult: number, prefix: string}) {
  const check = prefix.repeat(difficult)
  return hash.startsWith(check)
}
