export async function fetchAllUsers(client) {
    const data = await client.fetch(`*[_type == "bruker"]{
        _id,
        username,
        name,
        email,
        age,
        image {
            asset -> {
                url
            }
        },
        wishList[]->{apiId},
        previousPurchases[]->{apiId},
        friends[]->{
            _id,
            name,
            image {
                asset -> { url }
            },
            wishList[]->{apiId}    
        }
    }`);

    return data;
}

export async function fetchUserById(client, userId) {
    const user = await client.fetch(`*[_type == "bruker" && _id == $userId][0]{
        _id,
        username,
        name,
        email,
        age,
        image {
            asset -> {
                url
            }
        },
        wishList[]->{apiId},
        previousPurchases[]->{apiId},
        friends[]->{
            _id,
            name,
            image {
                asset -> { url }
            },
            wishList[]->{apiId}    
        }
    }`, { userId });

    return user;
}