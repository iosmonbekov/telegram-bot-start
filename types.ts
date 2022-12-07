
export interface Database {
    [key: number]: User
}

export interface User {
    chatId: number
    name?: string
    age?: number
    image?: File | string
    gender?: 'I\'m male' | 'I\'m female'
    interest?: 'Women' | 'Men' | 'No matter'
    description?: string
    city?: string
}