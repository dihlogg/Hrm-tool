"use client";

import {
  Avatar,
  Button,
  Empty,
  Pagination,
  message,
  Spin,
  Modal,
  Upload,
  Image as AntImage,
  Input,
  Carousel,
} from "antd";
import {
  ClockCircleOutlined,
  MessageOutlined,
  HeartFilled,
  UserOutlined,
  CloseOutlined,
  PlusOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useGetPostList } from "@/hooks/social/post/useGetPostList";
import { useGetTopReactedPost } from "@/hooks/social/post/useGetTopReactedPost";
import { useGetTopCommentedPost } from "@/hooks/social/post/useGetTopCommentedPost";
import { useAddPost } from "@/hooks/social/post/useAddPost";
import { useDeletePostById } from "@/hooks/social/post/useDeletePostById";
import { useUpdatePost } from "@/hooks/social/post/useUpdatePost";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import { PostDto } from "@/hooks/social/post/PostDto";
import PostCard from "@/components/buzz/post/PostCard";
import {
  CustomNextArrow,
  CustomPrevArrow,
} from "@/components/buzz/common/CarouselArrows";
// Import các mũi tên dùng chung

const { confirm } = Modal;
const { TextArea } = Input;

export default function BuzzPage() {
  const [activeTab, setActiveTab] = useState("recent");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [hotReload, setHotReload] = useState(0);

  const [postContent, setPostContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDto | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
  const [editUploadLoading, setEditUploadLoading] = useState(false);

  const { employee } = useAuthContext();

  const {
    posts: recentPosts,
    total: recentTotal,
    loading: loadingRecent,
  } = useGetPostList(page, pageSize, "createDate", "DESC", {}, hotReload);

  const {
    posts: likedPosts,
    total: likedTotal,
    loading: loadingLiked,
  } = useGetTopReactedPost(page, pageSize, "createDate", "DESC", {}, hotReload);

  const {
    posts: commentedPosts,
    total: commentedTotal,
    loading: loadingCommented,
  } = useGetTopCommentedPost(
    page,
    pageSize,
    "createDate",
    "DESC",
    {},
    hotReload,
  );

  const posts =
    activeTab === "recent"
      ? recentPosts
      : activeTab === "liked"
        ? likedPosts
        : commentedPosts;
  const total =
    activeTab === "recent"
      ? recentTotal
      : activeTab === "liked"
        ? likedTotal
        : commentedTotal;
  const loadingPosts =
    activeTab === "recent"
      ? loadingRecent
      : activeTab === "liked"
        ? loadingLiked
        : loadingCommented;

  const { addPost, loading: creatingPost } = useAddPost();
  const { deletePost } = useDeletePostById();
  const { updatePost, loading: updatingPost } = useUpdatePost();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && imageUrls.length === 0) {
      message.warning(
        "Please write something or upload an image before posting!",
      );
      return;
    }
    try {
      await addPost({
        content: postContent,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        status: "Active",
      });
      message.success("Post created successfully!");
      setPostContent("");
      setImageUrls([]);
      setHotReload((prev) => prev + 1);
      setPage(1);
      setActiveTab("recent");
    } catch (error: any) {
      message.error(error.message || "Failed to create post");
    }
  };

  const openEditModal = (post: PostDto) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditImageUrls(post.imageUrls || []);
    setIsEditModalOpen(true);
  };

  const handleEditPost = async () => {
    if (!editingPost) return;
    if (!editContent.trim() && editImageUrls.length === 0) {
      message.warning("Please write something or upload an image!");
      return;
    }
    try {
      await updatePost(editingPost.id, {
        content: editContent,
        imageUrls: editImageUrls.length > 0 ? editImageUrls : undefined,
      });
      message.success("Post updated successfully!");
      setIsEditModalOpen(false);
      setEditingPost(null);
      setHotReload((prev) => prev + 1);
    } catch (error: any) {
      message.error(error.message || "Failed to update post");
    }
  };

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

  return (
    <div className="flex flex-col justify-center w-full max-w-[1600px] gap-6 px-4 lg:px-8 mx-auto mt-2 lg:flex-row">
      {/* Left Sidebar - Navigation */}
      <div className="flex flex-col w-full gap-3 mt-13 lg:w-[22%] shrink-0">
        <button
          onClick={() => handleTabChange("recent")}
          className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "recent"
              ? "bg-[#FFA940] text-white shadow-sm"
              : "bg-[#E5E7EB] text-gray-500 hover:bg-gray-300"
          }`}
        >
          <ClockCircleOutlined className="text-lg" /> Most Recent Posts
        </button>
        <button
          onClick={() => handleTabChange("liked")}
          className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "liked"
              ? "bg-[#FFA940] text-white shadow-sm"
              : "bg-[#E5E7EB] text-gray-500 hover:bg-gray-300"
          }`}
        >
          <HeartFilled className="text-lg" /> Most Liked Posts
        </button>
        <button
          onClick={() => handleTabChange("commented")}
          className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "commented"
              ? "bg-[#FFA940] text-white shadow-sm"
              : "bg-[#E5E7EB] text-gray-500 hover:bg-gray-300"
          }`}
        >
          <MessageOutlined className="text-lg" /> Most Commented Posts
        </button>
      </div>

      <div className="flex flex-col w-full gap-4 lg:w-[53%] flex-1">
        <h2 className="text-lg font-bold text-gray-500">Buzz Newsfeed</h2>

        {/* Create Post Section */}
        <div className="flex flex-col gap-4 p-5 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center w-full gap-3">
              <Avatar
                src={employee?.imageUrl}
                icon={!employee?.imageUrl && <UserOutlined />}
                size={44}
                className="flex-shrink-0"
              />
              <input
                type="text"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePost();
                }}
                placeholder={`What's on your mind${employee?.firstName ? `, ${employee.firstName}` : ""}?`}
                className="flex-1 w-full text-base font-medium text-gray-700 placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0"
                disabled={creatingPost}
              />
            </div>
            <Button
              type="primary"
              loading={creatingPost}
              onClick={handleCreatePost}
              className="px-6 font-semibold text-white bg-[#859BBA] border-none rounded-lg hover:bg-[#6e85a5] shadow-sm h-10 flex-shrink-0"
            >
              Post
            </Button>
          </div>

          {imageUrls.length > 0 && (
            <div className="relative w-full mt-2 group">
              <Carousel
                arrows={imageUrls.length > 1}
                dots={imageUrls.length > 1}
                infinite={false}
                adaptiveHeight={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                className="w-full overflow-hidden rounded-xl"
              >
                {imageUrls.map((url, index) => (
                  <div key={index} className="outline-none">
                    <div className="relative flex items-center justify-center w-full h-[350px] sm:h-[450px] bg-[#F0F2F5] rounded-xl overflow-hidden border border-gray-200">
                      <AntImage
                        src={url}
                        alt={`preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <div
                        className="absolute top-2 right-2 z-20 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100"
                        onClick={() =>
                          setImageUrls((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <CloseOutlined
                          style={{ fontSize: "14px", color: "#4B5563" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-wrap gap-3 pt-4 mt-1 border-t border-gray-100">
            <Upload
              multiple
              showUploadList={false}
              beforeUpload={async (file) => {
                try {
                  setUploadLoading(true);
                  const url = await uploadImageToCloudinary(file);
                  setImageUrls((prev) => [...prev, url]);
                  message.success("Image uploaded successfully!");
                } catch (err) {
                  message.error("Image upload failed!");
                } finally {
                  setUploadLoading(false);
                }
                return false;
              }}
            >
              <button
                disabled={uploadLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center w-5 h-5 text-white bg-blue-500 rounded-full">
                  <PlusOutlined className="text-xs font-bold" />
                </div>
                Add Photo/Video
              </button>
            </Upload>
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
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={openEditModal}
                onDelete={handleDeletePost}
              />
            ))
          )}

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
      <div className="flex flex-col w-full gap-4 mt-13 lg:w-[25%] shrink-0">
        <h2 className="flex justify-center text-lg font-bold text-gray-500 align-center">
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

          {editImageUrls.length > 0 && (
            <div className="relative w-full group">
              <Carousel
                arrows={editImageUrls.length > 1}
                dots={editImageUrls.length > 1}
                infinite={false}
                adaptiveHeight={false}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                className="w-full overflow-hidden rounded-xl"
              >
                {editImageUrls.map((url, index) => (
                  <div key={index} className="outline-none">
                    <div className="relative flex items-center justify-center w-full h-[350px] sm:h-[450px] bg-[#F0F2F5] rounded-xl overflow-hidden border border-gray-200">
                      <AntImage
                        src={url}
                        alt={`edit-preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <div
                        className="absolute top-2 right-2 z-20 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100"
                        onClick={() =>
                          setEditImageUrls((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <CloseOutlined
                          style={{ fontSize: "14px", color: "#4B5563" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          <div>
            <Upload
              multiple
              showUploadList={false}
              beforeUpload={async (file) => {
                try {
                  setEditUploadLoading(true);
                  const url = await uploadImageToCloudinary(file);
                  setEditImageUrls((prev) => [...prev, url]);
                  message.success("Image uploaded successfully!");
                } catch (err) {
                  message.error("Image upload failed!");
                } finally {
                  setEditUploadLoading(false);
                }
                return false;
              }}
            >
              <Button loading={editUploadLoading} icon={<PictureOutlined />}>
                Add Photo
              </Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
}
