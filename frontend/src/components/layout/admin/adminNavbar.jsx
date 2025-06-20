import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      current: location.pathname === "/admin/dashboard",
    },
    {
      name: "Category",
      href: "/admin/view-all-category",
      current:
        location.pathname.startsWith("/admin/view-all-category") ||
        location.pathname.startsWith("/admin/add-category") ||
        location.pathname.startsWith("/admin/edit-category"),
    },
    {
      name: "Services",
      href: "/admin/view-all-services",
      current:
        location.pathname.startsWith("/admin/view-all-services") ||
        location.pathname.startsWith("/admin/add-services") ||
        location.pathname.startsWith("/admin/edit-services"),
    },
    {
      name: "Application",
      href: "/admin/view-all-application",
      current:
        location.pathname.startsWith("/admin/view-all-application") ||
        location.pathname.startsWith("/admin/add-services") ||
        location.pathname.startsWith("/admin/edit-services"),
    },
    {
      name: "User",
      href: "/admin/view-all-user",
      current:
        location.pathname.startsWith("/admin/view-all-user") ||
        location.pathname.startsWith("/admin/add-user") ||
        location.pathname.startsWith("/admin/edit-user"),
    },

    {
      name: "Miscellaneous ",
      subItems: [
        {
          name: "Gallery",
          href: "/admin/view-all-gallery",
          current:
            location.pathname.startsWith("/admin/view-all-gallery") ||
            location.pathname.startsWith("/admin/add-gallery") ||
            location.pathname.startsWith("/admin/edit-gallery"),
        },
        {
          name: "Partners",
          href: "/admin/view-all-partner",
          current:
            location.pathname.startsWith("/admin/view-all-partner") ||
            location.pathname.startsWith("/admin/add-partner") ||
            location.pathname.startsWith("/admin/edit-partner"),
        },
        {
          name: "Contact",
          href: "/admin/view-contact",
          current: location.pathname.startsWith("/admin/view-contactr"),
        },
        {
          name: "Feedback",
          href: "/admin/view-feedback",
          current: location.pathname.startsWith("/admin/view-feedback"),
        },
      ],
    },
    // {
    //   name: "Projects",
    //   subItems: [
    //     {
    //       name: "Project X",
    //       href: "/admin/project-x",
    //       current: location.pathname === "/admin/team-a",
    //     },
    //     {
    //       name: "Project Y",
    //       href: "/admin/project-y",
    //       current: location.pathname === "/admin/team-a",
    //     },
    //   ],
    // },
    // {
    //   name: "Calendar",
    //   href: "/admin/calendar",
    //   current: location.pathname === "/admin/calendar",
    // },
  ];
  
  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("showWelcomeToast"); 
      toast.success("Logged out successfully!");
      setTimeout(() => {        
        navigate("/backend/login");
      }, 1000);
      
      
    };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src={logo}
                className="h-10 w-auto cursor-pointer rounded-full"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) =>
                  item.subItems ? (
                    <Menu
                      as="div"
                      className="relative inline-block text-left"
                      key={item.name}
                    >
                      <div>
                        <MenuButton className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                          {item.name}
                          <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-300" />
                        </MenuButton>
                      </div>
                      <MenuItems className="absolute left-0 mt-2 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        {item.subItems.map((sub) => (
                          <MenuItem key={sub.name}>
                            {({ active }) => (
                              <a
                                href={sub.href}
                                className={classNames(
                                  location.pathname === sub.href
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                {sub.name}
                              </a>
                            )}
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Menu>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button> */}

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full cursor-pointer"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                {/* <MenuItem>
                  <Link
                    to="/admin-profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Your Profile
                  </Link>
                </MenuItem> */}
                {/* <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem> */}
                <MenuItem>
                  <Link
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) =>
            item.subItems ? (
              <div key={item.name} className="space-y-1">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <DisclosureButton className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        {item.name}
                        <ChevronDownIcon
                          className={`h-4 w-4 transform transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="space-y-1 pl-6">
                        {item.subItems.map((sub) => (
                          <a
                            key={sub.name}
                            href={sub.href}
                            className="block rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>
            ) : (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            )
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
