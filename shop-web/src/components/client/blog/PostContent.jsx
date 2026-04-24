import { Typography, Divider } from "antd";

const PostContent = ({ content }) => {
  return (
    <div
      style={{
        marginTop: 24,
        background: "#fff",
        padding: 24,
        borderRadius: 12,
      }}
    >
      <Typography
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: "#333",
        }}
      >
        <div
          className="antd-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Typography>

      <Divider />
    </div>
  );
};

export default PostContent;