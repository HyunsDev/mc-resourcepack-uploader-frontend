import axios from "axios";
import {
    Button,
    CenterLayout,
    Flex,
    ItemsTable,
    useDialog,
    FileField,
    TextField,
    Box,
    Text,
    Span,
    cv,
    useTopLoading,
} from "opize-design-system";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "../../components/header";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { formatBytes } from "../../utils/formatBytes";
import { Clipboard, X } from "phosphor-react";
import { toast } from "react-toastify";
dayjs.locale("ko");
dayjs.extend(relativeTime);

function FileUpload({ refetch }: { refetch: () => Promise<void> }) {
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState<any>();
    const { start, end } = useTopLoading();
    const [isLoading, setIsLoading] = useState(false);

    const fileChange = (file: any) => {
        console.log(file);
        setFile(file);
        setFileName(file.name);
    };

    const upload = async () => {
        try {
            setIsLoading(true);
            start();

            const res1 = await axios.post(
                `https://apiv2.hyuns.dev/resource`,
                {
                    key: `resourcepack/${fileName}`,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                }
            );

            await axios.put(res1.data.url, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });
            await refetch();
            toast.info("업로드를 완료했어요.");
        } catch (err) {
            toast.error("문제가 발생했어요.");
            console.error(err);
        } finally {
            setIsLoading(false);
            end();
        }
    };

    return (
        <Box
            footer={
                <>
                    <Text>
                        최대 용량 4GB <Span color={cv.text3}>(아마도?)</Span>
                    </Text>
                    <Button
                        variant="contained"
                        onClick={upload}
                        isLoading={isLoading}
                    >
                        업로드
                    </Button>
                </>
            }
        >
            <Flex.Column gap="8px">
                <FileField
                    label="업로드"
                    onChange={(e: any) => fileChange(e)}
                />
                <TextField
                    label="파일 이름"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                />
            </Flex.Column>
        </Box>
    );
}

const FileListDivver = styled.div`
    width: 400px;
    display: flex;
    flex-direction: column;
`;

function FileListRow({
    file,
    refetch,
}: {
    file: { Key: string; LastModified: string; Size: number };
    refetch: () => Promise<void>;
}) {
    const dialog = useDialog();

    const copyText = () => {
        navigator.clipboard.writeText(`https://s3.hyuns.dev/${file.Key}`);
        toast.info("클립보드에 복사했어요.");
    };

    const removeApiReq = async () => {
        try {
            await axios.delete(`https://apiv2.hyuns.dev/resource/${file.Key}`, {
                headers: {
                    Authorization: localStorage.getItem("token") || "",
                },
            });
            await refetch();
            toast.info("리소스팩을 삭제했어요.");
        } catch (err) {
            console.error(err);
        }
    };

    const remove = () => {
        if (!file.Key.startsWith("resourcepack")) {
            toast.info(
                "만약 이 알림이 떳다면 현우에게 알려주세요. (권한에러1)"
            );
            return;
        }

        dialog({
            title: "정말로 리소스팩을 삭제하시겠어요?",
            content: "삭제한 리소스팩은 되돌릴 수 없어요.",
            buttons: [
                {
                    children: "취소",
                    onClick: () => null,
                },
                {
                    children: "삭제",
                    onClick: () => removeApiReq(),
                    color: "red",
                    variant: "contained",
                },
            ],
        });
    };

    return (
        <ItemsTable.Row key={file.Key}>
            <ItemsTable.Row.Text
                text={file.Key}
                subText={`${dayjs().to(file.LastModified)} | ${formatBytes(
                    file.Size
                )}`}
            />
            <ItemsTable.Row.Buttons
                buttons={[
                    [
                        {
                            label: "링크 복사",
                            onClick: () => {
                                copyText();
                            },
                            icon: <Clipboard />,
                        },
                        {
                            label: "삭제",
                            onClick: () => remove(),
                            icon: <X />,
                            color: "red",
                        },
                    ],
                ]}
            />
        </ItemsTable.Row>
    );
}

function FileList({
    list,
    refetch,
}: {
    list: {
        Key: string;
        LastModified: string;
        Size: number;
    }[];
    refetch: () => Promise<void>;
}) {
    useEffect(() => {
        (async () => {
            await refetch();
        })();
    }, []);

    return (
        <FileListDivver>
            <ItemsTable>
                {list.map((item) => (
                    <FileListRow file={item} key={item.Key} refetch={refetch} />
                ))}
            </ItemsTable>
        </FileListDivver>
    );
}

export function IndexPage() {
    const [list, setList] = useState<
        {
            Key: string;
            LastModified: string;
            Size: number;
        }[]
    >([]);

    const fetch = async () => {
        (async () => {
            try {
                const res = await axios.get(
                    "https://apiv2.hyuns.dev/resource",
                    {
                        headers: {
                            Authorization: localStorage.getItem("token") || "",
                        },
                    }
                );
                setList(
                    res.data.fileList.Contents.filter((e: any) =>
                        e.Key.startsWith("resourcepack/")
                    )
                );
            } catch (err) {
                console.error(err);
            }
        })();
    };

    return (
        <>
            <Header />
            <CenterLayout minHeight="calc(100vh - 52px)">
                <Flex.Column gap="8px">
                    <FileList list={list} refetch={fetch} />
                    <FileUpload refetch={fetch} />
                    <Flex.Center>
                        <Text
                            color={cv.text3}
                            size={"12px"}
                            style={{ textAlign: "center" }}
                        >
                            https://github.com/HyunsDev/mc-resourcepack-uploader-frontend
                            <br />
                            Powered By Hyuns API
                        </Text>
                    </Flex.Center>
                </Flex.Column>
            </CenterLayout>
        </>
    );
}
