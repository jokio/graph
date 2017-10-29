

export function userLanguageMap(user) {
    if (!user)
        return null;

    switch (user.language) {
        case 'en-US':
            user.language = 'en';
            break;
        case 'ka-GE':
            user.language = 'ge';
            break;
        case 'ru-RU':
            user.language = 'ru';
            break;
    }

    return user;
}
