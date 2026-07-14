import Link from 'next/link'

type AdminPageHeaderProps = {
  title: string
  description: string
  eyebrow?: string
  action?: {
    href: string
    label: string
  }
}

export default function AdminPageHeader({ title, description, eyebrow, action }: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div>
        {eyebrow && <p>{eyebrow}</p>}
        <h2>{title}</h2>
        <span>{description}</span>
      </div>
      {action && (
        <Link href={action.href} className="admin-primary-action">
          {action.label}
        </Link>
      )}
    </div>
  )
}
