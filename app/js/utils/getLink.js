const getLink = (key, params) => {
    switch (key) {
        case '':
        case 'home':
        case 'todos':
            return `/${key}`
        default:
            return 'badLink'
    }
}

export default getLink
