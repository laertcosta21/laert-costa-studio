import { forwardRef, type CSSProperties, type ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = '', style }, ref) => (
    <div
      ref={ref}
      style={style}
      className={`w-full max-w-[1800px] mx-auto px-5 md:px-9 ${className}`}
    >
      {children}
    </div>
  )
)

Container.displayName = 'Container'
