"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation";
import React from "react";

type NavigationBreadCrumbsProps = {
  currentTitle?: string
}

const NavigationBreadCrumbs = ({ currentTitle }: NavigationBreadCrumbsProps) => {
  const pathname = usePathname();
  const paths = pathname.split('/');
  const isId = (val: string) => /^\d+$/.test(val) || val.length > 10;
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${paths[1]}`}>{paths[1]}</BreadcrumbLink>
          </BreadcrumbItem>
          {paths.slice(2).map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${paths.slice(1, index + 3).join("/")}`}>
                  {isId(path) && currentTitle ? currentTitle : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default NavigationBreadCrumbs
