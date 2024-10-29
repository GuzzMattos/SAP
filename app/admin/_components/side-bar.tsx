import { GetUserRole, LogoutAction, GetUserName } from '@/app/_actions/user'
import { Button } from '@/components/ui/button'
import { getLinksByRole, UserRole } from '@/lib/links'
import Image from 'next/image'
import Link from 'next/link'

const SideBar = async () => {
  const role = await GetUserRole()
  const userName = await GetUserName()

  const adminLinks = getLinksByRole(role as unknown as UserRole)

  return (
    <aside className="bg-secondary sticky top-0 hidden size-full min-w-[250px] max-w-[250px] flex-col items-start justify-between border-r p-5 lg:flex">
      <Image src={'/assets/logo.png'} alt="logo CDI" width={200} height={100} />

      <div className='w-full flex flex-col items-start gap-5'>
        {adminLinks.map((link, index) => (
          <Button key={index} asChild variant={"default"} className='w-full justify-start'>
            <Link href={link.url} className="flex items-center gap-3">
              {link.icon}
              {link.title}
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex flex-col items-start gap-2">
        <p>{userName}</p>
        <form action={LogoutAction}>
          <Button type="submit">
            Sair
          </Button>
        </form>
      </div>
    </aside>
  )
}

export default SideBar