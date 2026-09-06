type LoginInput = {
    usernameOrEmail?: string;
    password?: string;
};

const parseUsernameOrEmail = (data: LoginInput) => {
    const { usernameOrEmail, password } = data;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = emailRegex.test(usernameOrEmail ?? "");
    return {
        username: isEmail ? undefined : usernameOrEmail,
        email: isEmail ? usernameOrEmail : undefined,
        password,
    };
};

export { parseUsernameOrEmail };
