"use client";

export function DeleteArticleButton({ articleId, deleteArticle }) {
  return (
    <form
      action={deleteArticle}
      onSubmit={(event) => {
        if (!window.confirm("删除后无法恢复文章、历史版本、观看与点赞记录。确认删除吗？")) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={articleId} />
      <button className="danger-button" type="submit">删除</button>
    </form>
  );
}
