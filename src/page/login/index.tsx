import axios, { AxiosError } from "axios";
import {
    Button,
    CenterLayout,
    cv,
    Divider,
    Flex,
    H1,
    Text,
    TextField,
} from "opize-design-system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Header } from "../../components/header";

const LoginBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 300px;
    gap: 12px;
`;

export function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async (id: string, password: string) => {
        try {
            const res = await axios.post("https://apiv2.hyuns.dev/auth/login", {
                id,
                password,
            });
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.data.code === "WRONG_PASSWORD") {
                    toast.warn("비밀번호가 틀렸어요");
                } else if (err.response?.status === 404) {
                    toast.warn("사용자를 찾을 수 없어요.");
                } else {
                    toast.error("서버에서 알 수 없는 응답을 했어요.");
                }
            } else {
                toast.error("서버에 연결할 수 없어요.");
            }
            console.error(err);
        }
    };

    return (
        <>
            <Header />
            <CenterLayout minHeight="calc(100vh - 52px)" width="300px">
                <LoginBox>
                    <H1>로그인</H1>
                    <TextField
                        label="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Flex.Between style={{ width: "100%" }}>
                        <Text size="12px" color={cv.text2}>
                            미리 등록된 사람만 이용할 수 있습니다.
                        </Text>
                        <Button
                            variant="contained"
                            onClick={() => login(id, password)}
                        >
                            로그인
                        </Button>
                    </Flex.Between>
                </LoginBox>
            </CenterLayout>
        </>
    );
}
