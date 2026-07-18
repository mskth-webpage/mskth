import BoardMemberPresenter from "@/presenter/admin/BoardMemberPresenter";
import ProjectGroupPresenter from "@/presenter/admin/ProjectGroupPresenter";

export default function BoardMemberPage() {
  return (
    <>
      <BoardMemberPresenter />
      <div className="mt-8">
        <ProjectGroupPresenter />
      </div>
    </>
  );
}
