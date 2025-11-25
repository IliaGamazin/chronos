import jwt from "jsonwebtoken";

export const generate_access_token = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
}

export const generate_refresh_token = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d"
    });
}

export const verify_access_token = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export const verify_refresh_token = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

export const generate_token_pair = (payload) => {
    const access_payload = payload;
    const refresh_payload = {id: payload.id};

    return {
        access_token: generate_access_token(access_payload),
        refresh_token: generate_refresh_token(refresh_payload),
    }
}

export const generate_invite_token = (payload) => {
    return jwt.sign(payload, process.env.INVITE_SECRET, { expiresIn: "10m" });
}

export const verify_invite_token = (token) => {
    return jwt.verify(token, process.env.INVITE_SECRET);
}
