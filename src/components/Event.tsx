"use client"
export default function Event({ title, description }: { title: String, description: String }) {
  return (
    <div
      className="flex h-[325px] w-[325px] items-center justify-center rounded-full bg-cover bg-center"
      style={{ backgroundImage: "url('/Checker.png')" }}
    >
    <p className="
        font-serif
        font-bold
        text-[36px]
        leading-[52px]
        tracking-normal
        underline
        decoration-solid
        underline-offset-auto
    ">
        {title}
    </p>
    </div>
  )
}