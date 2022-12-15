import * as bcrypt from 'bcrypt'

export function encodePassword(rawPassword: string) {
    return bcrypt.hashSync(rawPassword, 10)
}

export function comparePassword(rawPassword: string, hash: string) {
    return bcrypt.compareSync(rawPassword, hash)
}