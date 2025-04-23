

export default function MealSkeleton() {

    const Skeleton = ({ className }: { className: string }) => (
        <div aria-live="polite" aria-busy="true" className={className}>
            <span className="inline-flex w-full animate-pulse select-none rounded-md bg-muted leading-none">
                ‌
            </span>
            <br />
        </div>
    )

    return (
        <li className="flex flex-col p-2">
            <div className="flex flex-row justify-between items-center">
                <h3>
                    <Skeleton className="w-[40px] max-w-full" />
                </h3>
                <div>
                    <Skeleton className="w-[64px] max-w-full" />
                </div>
            </div>
            <span>
                <Skeleton className="w-[344px] max-w-full" />
            </span>
        </li>
    )
}