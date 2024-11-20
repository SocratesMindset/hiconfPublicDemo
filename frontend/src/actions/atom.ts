import { atom } from 'jotai'

const authAtom = atom(localStorage.getItem('auth') === 'true')

export { authAtom }
