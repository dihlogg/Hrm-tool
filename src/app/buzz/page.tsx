"use client";

import {
  Avatar,
  Button,
  Dropdown,
  Empty,
  Pagination,
  message,
  Spin,
  Modal,
  Upload,
  Image as AntImage,
  Input,
} from "antd";
import {
  MoreOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  ShareAltOutlined,
  CameraFilled,
  VideoCameraFilled,
  HeartFilled,
  UserOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useGetPostList } from "@/hooks/social/post/useGetPostList";
import { useAddPost } from "@/hooks/social/post/useAddPost";
import { useDeletePostById } from "@/hooks/social/post/useDeletePostById";
import { useUpdatePost } from "@/hooks/social/post/useUpdatePost";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import { PostDto } from "@/hooks/social/post/PostDto";

const { confirm } = Modal;
const { TextArea } = Input;

export default function BuzzPage() {
  const [activeTab, setActiveTab] = useState("recent");

  // State phân trang & re-fetch
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [hotReload, setHotReload] = useState(0);

  // State input tạo bài viết
  const [postContent, setPostContent] = useState("");

  // State quản lý upload ảnh tạo bài viết
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // State quản lý chỉnh sửa bài viết
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDto | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [editUploadLoading, setEditUploadLoading] = useState(false);

  // Hooks
  const { employee } = useAuthContext();
  const {
    posts,
    total,
    loading: loadingPosts,
  } = useGetPostList(page, pageSize, "createDate", "DESC", {}, hotReload);
  const { addPost, loading: creatingPost } = useAddPost();
  const { deletePost } = useDeletePostById();
  const { updatePost, loading: updatingPost } = useUpdatePost();

  // Xử lý tạo bài viết
  const handleCreatePost = async () => {
    if (!postContent.trim() && !imageUrl) {
      message.warning(
        "Please write something or upload an image before posting!",
      );
      return;
    }
    try {
      await addPost({
        content: postContent,
        imageUrl: imageUrl || undefined,
        status: "Active",
      });
      message.success("Post created successfully!");
      setPostContent("");
      setImageUrl(null);
      setHotReload((prev) => prev + 1);
      setPage(1);
    } catch (error: any) {
      message.error(error.message || "Failed to create post");
    }
  };

  // Mở modal Edit
  const openEditModal = (post: PostDto) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditImageUrl(post.imageUrl || null);
    setIsEditModalOpen(true);
  };

  // Xử lý lưu bài viết đang edit
  const handleEditPost = async () => {
    if (!editingPost) return;
    if (!editContent.trim() && !editImageUrl) {
      message.warning("Please write something or upload an image!");
      return;
    }
    try {
      await updatePost(editingPost.id, {
        content: editContent,
        imageUrl: editImageUrl || undefined,
      });
      message.success("Post updated successfully!");
      setIsEditModalOpen(false);
      setEditingPost(null);
      setHotReload((prev) => prev + 1);
    } catch (error: any) {
      message.error(error.message || "Failed to update post");
    }
  };

  // Xử lý xoá bài viết
  const handleDeletePost = (postId: string) => {
    confirm({
      title: "Delete Post",
      content: "Are you sure you want to delete this post?",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deletePost(postId);
          message.success("Post deleted successfully!");
          setHotReload((prev) => prev + 1);
        } catch (error: any) {
          message.error(error.message || "Failed to delete post");
        }
      },
    });
  };

  // Hàm phụ trợ đếm số Like từ mảng reactionCounts
  const getLikesCount = (reactionCounts?: any[]) => {
    if (!reactionCounts) return 0;
    const likeReaction = reactionCounts.find(
      (r) => r.reactionType.toUpperCase() === "LIKE",
    );
    return likeReaction ? likeReaction.count : 0;
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-[1600px] gap-6 px-4 lg:px-8 mx-auto mt-6 lg:flex-row">
      {/* Left Sidebar - Navigation */}
      <div className="flex flex-col w-full gap-3 mt-8 lg:w-[22%] shrink-0">
        <button
          onClick={() => setActiveTab("recent")}
          className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "recent"
              ? "bg-[#FFA940] text-white shadow-sm"
              : "bg-[#E5E7EB] text-gray-500 hover:bg-gray-300"
          }`}
        >
          <ClockCircleOutlined className="text-lg" />
          Most Recent Posts
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "liked"
              ? "bg-[#E2E8F0] text-gray-600 shadow-sm"
              : "bg-[#E5E7EB] text-gray-500 hover:bg-gray-300"
          }`}
        >
          <HeartFilled className="text-lg" />
          Most Liked Posts
        </button>
        <button
          onClick={() => setActiveTab("commented")}
          className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "commented"
              ? "bg-[#E2E8F0] text-gray-600 shadow-sm"
              : "bg-[#E5E7EB] text-gray-500 hover:bg-gray-300"
          }`}
        >
          <MessageOutlined className="text-lg" />
          Most Commented Posts
        </button>
      </div>

      {/* Center - Main Feed */}
      <div className="flex flex-col w-full gap-4 lg:w-[53%] flex-1">
        <h2 className="text-lg font-bold text-gray-500">Buzz Newsfeed</h2>

        {/* Create Post Section */}
        <div className="p-5 bg-white shadow-sm rounded-2xl">
          <div className="flex items-start gap-3">
            <Avatar
              src={employee?.imageUrl}
              icon={!employee?.imageUrl && <UserOutlined />}
              size={48}
              className="flex-shrink-0 mt-1"
            />
            {/* Input & Preview wrapper */}
            <div className="flex flex-col flex-1 gap-3">
              <div className="flex items-center w-full py-1.5 pl-4 pr-1.5 border border-gray-200 rounded-full bg-gray-50 focus-within:bg-white focus-within:border-orange-300 transition-colors">
                <input
                  type="text"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreatePost();
                  }}
                  placeholder={`What's on your mind${employee?.firstName ? `, ${employee.firstName}` : ""}?`}
                  className="flex-1 w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent focus:outline-none"
                  disabled={creatingPost}
                />
                <Button
                  type="primary"
                  shape="round"
                  loading={creatingPost}
                  onClick={handleCreatePost}
                  className="px-6 ml-2 font-semibold text-white transition-colors bg-[#FF8C00] border-none hover:bg-orange-600 shadow-none"
                >
                  Post
                </Button>
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="relative inline-block w-max">
                  <AntImage
                    src={imageUrl}
                    alt="preview"
                    className="object-cover rounded-lg max-h-48"
                  />
                  <Button
                    type="text"
                    shape="circle"
                    icon={
                      <CloseCircleFilled className="text-xl text-gray-500 bg-white rounded-full hover:text-red-500" />
                    }
                    className="absolute top-1 right-1"
                    onClick={() => setImageUrl(null)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-5 sm:gap-8">
            <Upload
              showUploadList={false}
              beforeUpload={async (file) => {
                try {
                  setUploadLoading(true);
                  const url = await uploadImageToCloudinary(file);
                  setImageUrl(url);
                  message.success("Image uploaded successfully!");
                } catch (err) {
                  console.error(err);
                  message.error("Image upload failed!");
                } finally {
                  setUploadLoading(false);
                }
                return false;
              }}
            >
              <Button
                loading={uploadLoading}
                type="text"
                className="flex items-center justify-center h-auto gap-2 px-6 py-2 text-sm font-semibold text-gray-600 transition-colors rounded-full bg-gray-50 hover:bg-gray-100"
              >
                <CameraFilled className="text-xl text-green-500" />
                Share Photos
              </Button>
            </Upload>

            <button className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-gray-600 transition-colors rounded-full bg-gray-50 hover:bg-gray-100">
              <VideoCameraFilled className="text-xl text-orange-400" />
              Share Video
            </button>
          </div>
        </div>

        {/* Post List */}
        <div className="flex flex-col gap-4 pb-8">
          {loadingPosts ? (
            <div className="flex items-center justify-center p-10 bg-white shadow-sm rounded-2xl">
              <Spin size="large" />
            </div>
          ) : posts.length === 0 ? (
            <div className="p-10 bg-white shadow-sm rounded-2xl">
              <Empty description="No posts available" />
            </div>
          ) : (
            posts.map((post) => {
              const likesCount = getLikesCount(post.reactionCounts);
              const commentsCount = post.postComments?.length || 0;
              const sharesCount = 0;

              return (
                <div key={post.id} className="bg-white shadow-sm rounded-2xl">
                  {/* Post Header */}
                  <div className="flex items-start justify-between p-5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={post.employeeAvatarUrl || undefined}
                        icon={!post.employeeAvatarUrl && <UserOutlined />}
                        size={48}
                        className="cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-600 cursor-pointer hover:underline">
                          {post.employeeFullName || "Unknown Employee"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.createDate)
                            .toLocaleString("en-CA", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .replace(",", "")}
                        </span>
                      </div>
                    </div>

                    <Dropdown
                      trigger={["click"]}
                      placement="bottomRight"
                      menu={{
                        items: [
                          {
                            key: "edit",
                            label: <span>Edit Post</span>,
                            onClick: () => openEditModal(post),
                          },
                          {
                            key: "delete",
                            label: (
                              <span className="text-red-500">Delete Post</span>
                            ),
                            onClick: () => handleDeletePost(post.id),
                          },
                        ],
                      }}
                    >
                      <Button
                        type="text"
                        shape="circle"
                        className="flex items-center justify-center"
                        icon={
                          <MoreOutlined className="text-xl text-gray-400" />
                        }
                      />
                    </Dropdown>
                  </div>

                  {/* Post Content */}
                  <div className="px-5 pb-4 text-sm text-gray-600 whitespace-pre-wrap">
                    {post.content}
                  </div>

                  {/* Hiển thị hình ảnh của Post */}
                  {post.imageUrl && (
                    <div className="px-5 pb-4">
                      <AntImage
                        src={post.imageUrl}
                        alt="post image"
                        className="object-cover rounded-xl max-h-[400px] w-auto"
                      />
                    </div>
                  )}

                  {/* Post Footer */}
                  <div className="flex items-center justify-between px-5 pt-2 pb-5 mt-2 border-t border-gray-50">
                    <div className="flex gap-3">
                      <button className="flex items-center justify-center transition-colors bg-gray-100 rounded-full w-9 h-9 hover:bg-gray-200">
                        <HeartFilled className="text-gray-600" />
                      </button>
                      <button className="flex items-center justify-center transition-colors bg-gray-100 rounded-full w-9 h-9 hover:bg-gray-200">
                        <MessageOutlined className="text-gray-600" />
                      </button>
                      <button className="flex items-center justify-center transition-colors bg-gray-100 rounded-full w-9 h-9 hover:bg-gray-200">
                        <ShareAltOutlined className="text-gray-600" />
                      </button>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
                        <HeartFilled className="text-red-500" />
                        <span>{likesCount} Likes</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {commentsCount} Comments, {sharesCount} Shares
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {posts.length > 0 && (
            <div className="flex justify-center mt-2">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="flex flex-col w-full gap-4 lg:w-[25%] shrink-0">
        <h2 className="text-lg font-bold text-gray-500">
          Upcoming Anniversaries
        </h2>
        <div className="flex flex-col items-center justify-center p-8 mt-2">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            styles={{ image: { height: 120, opacity: 0.6 } }}
            description={
              <span className="text-sm font-medium text-gray-400">
                No Records Found
              </span>
            }
          />
        </div>
      </div>

      {/* Edit Post Modal */}
      <Modal
        title={<span className="text-gray-600">Edit Post</span>}
        open={isEditModalOpen}
        onOk={handleEditPost}
        onCancel={() => setIsEditModalOpen(false)}
        confirmLoading={updatingPost}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-orange-500 hover:!bg-orange-600 border-none",
        }}
      >
        <div className="flex flex-col gap-4 mt-4">
          <TextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            placeholder="Edit your post content..."
            className="rounded-lg"
          />

          {editImageUrl && (
            <div className="relative inline-block w-max">
              <AntImage
                src={editImageUrl}
                alt="preview"
                className="object-cover rounded-lg max-h-48"
              />
              <Button
                type="text"
                shape="circle"
                icon={
                  <CloseCircleFilled className="text-xl text-gray-500 bg-white rounded-full hover:text-red-500" />
                }
                className="absolute top-1 right-1"
                onClick={() => setEditImageUrl(null)}
              />
            </div>
          )}

          <div>
            <Upload
              showUploadList={false}
              beforeUpload={async (file) => {
                try {
                  setEditUploadLoading(true);
                  const url = await uploadImageToCloudinary(file);
                  setEditImageUrl(url);
                  message.success("Image uploaded successfully!");
                } catch (err) {
                  console.error(err);
                  message.error("Image upload failed!");
                } finally {
                  setEditUploadLoading(false);
                }
                return false;
              }}
            >
              <Button loading={editUploadLoading} icon={<CameraFilled />}>
                {editImageUrl ? "Change Photo" : "Add Photo"}
              </Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
}
