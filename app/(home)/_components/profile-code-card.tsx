function ProfileCodeCard() {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 from-muted/20 to-transparent rounded-3xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-surface rounded-xl border border-border overflow-hidden">
        <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-muted" />
            <div className="size-3 rounded-full bg-muted" />
            <div className="size-3 rounded-full bg-muted" />
          </div>
          <span className="ml-auto text-[10px] font-mono">developer.ts</span>
        </div>

        <div className="p-5 font-mono text-xs sm:text-sm leading-6">
          <div>
            <span className="text-purple-500">const</span> developer = {"{"}
          </div>
          <div className="pl-4">
            name: <span className="text-green-500">&quot;Seong Yeon&quot;</span>
            ,
          </div>
          <div className="pl-4">
            role: <span className="text-green-500">&quot;Frontend&quot;</span>,
          </div>
          <div className="pl-4">values: [</div>
          <div className="pl-8">
            <span className="text-green-500">&quot;문서화&quot;</span>,
          </div>
          <div className="pl-8">
            <span className="text-green-500">&quot;사용자 경험&quot;</span>,
          </div>
          <div className="pl-8">
            <span className="text-green-500">&quot;함께 성장&quot;</span>
          </div>
          <div className="pl-4">],</div>
          <div className="pl-4">
            coffee: <span className="text-blue-500">true</span>
          </div>
          <div>{"}"}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCodeCard;
