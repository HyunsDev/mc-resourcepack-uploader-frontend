import {
    Button,
    cv,
    Flex,
    SimpleHeader as OpizeHeader,
    Span,
    Text,
    useColorTheme,
} from "opize-design-system";
import { Moon, Sun } from "phosphor-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const MainText = styled(Link)`
    text-decoration: none;
    color: ${cv.text1};
`;

export function Header() {
    const { setColorTheme, colorTheme, nowColorTheme } = useColorTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!localStorage.getItem("token") && location.pathname !== "/login") {
            navigate("/login");
            toast.info("로그인이 필요해요");
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <OpizeHeader>
            <MainText to={"/"}>
                리소스팩 업로더{" "}
                <Span color={cv.text3} size={"12px"}>
                    By Hyuns API
                </Span>
            </MainText>
            <Flex.Row gap="8px">
                <Button
                    variant="text"
                    icon={nowColorTheme === "light" ? <Sun /> : <Moon />}
                    onClick={() =>
                        setColorTheme(colorTheme === "light" ? "dark" : "light")
                    }
                    borderRadius={999}
                />
                {localStorage.getItem("token") ? (
                    <Button onClick={() => logout()} variant="text">
                        로그아웃
                    </Button>
                ) : (
                    <Button as={"a"} href="/login" variant="contained">
                        로그인
                    </Button>
                )}
            </Flex.Row>
        </OpizeHeader>
    );
}
