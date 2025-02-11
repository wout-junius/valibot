import { ArrowLeftIcon, ArrowRightIcon, PenIcon } from '~/icons';
import { IconButton } from './IconButton';
import { Navigation } from './Navigation';
import { SideBar } from './SideBar';
import {
  type ContentMenu,
  useContent,
  useLocation,
  useDocumentHead,
} from '@builder.io/qwik-city';
import { Slot, component$, useComputed$ } from '@builder.io/qwik';
import '../styles/pace.css';

type NavItem = ContentMenu & { group: string };

/**
 * Provides the layout for the documentation pages.
 */
export const DocsLayout = component$(() => {
  // Use location, content and docuemnt head
  const location = useLocation();
  const content = useContent();
  const documentHead = useDocumentHead();

  // Compute navigation items
  const navItems = useComputed$(
    () =>
      content.menu?.items?.reduce<NavItem[]>(
        (list, { text, items }) =>
          items
            ? [...list, ...items.map((item) => ({ ...item, group: text }))]
            : list,
        []
      ) || []
  );

  // Compute current navigation index
  const navIndex = useComputed$(() =>
    navItems.value.findIndex((item) => item.href === location.url.pathname)
  );

  // Compute previous, current and next page
  const prevPage = useComputed$<NavItem | undefined>(
    () => navItems.value[navIndex.value - 1]
  );
  const currentPage = useComputed$<NavItem | undefined>(
    () => navItems.value[navIndex.value]
  );
  const nextPage = useComputed$<NavItem | undefined>(
    () => navItems.value[navIndex.value + 1]
  );

  // Compute contributors
  const contributors = useComputed$<string[]>(
    () => documentHead.frontmatter.contributors || []
  );

  return (
    <div class="flex w-full max-w-screen-xl flex-1 flex-col-reverse self-center lg:flex-row">
      {/* Side bar navigation */}
      <SideBar>
        <div q:slot="buttons" class="mr-4 flex space-x-6 lg:hidden">
          <NavButtons
            pageIndex={navIndex.value}
            prevPage={prevPage.value}
            nextPage={nextPage.value}
          />
        </div>
        <div class="space-y-9 lg:space-y-12">
          <Navigation />
        </div>
      </SideBar>

      <main class="relative flex-1 py-12 md:py-20 lg:w-px lg:py-32 lg:pl-9">
        {/* Navigation buttons */}
        <div class="hidden px-8 lg:absolute lg:right-0 lg:flex lg:space-x-6 lg:px-10">
          <NavButtons
            pageIndex={navIndex.value}
            prevPage={prevPage.value}
            nextPage={nextPage.value}
          />
        </div>

        {/* Article */}
        <article class="mdx">
          <Slot />
        </article>

        {/* Contributors */}
        {contributors.value.length > 0 && (
          <div class="mx-8 mt-10 border-t-2 pt-10 dark:border-slate-800 md:mt-12 md:pt-12 lg:mx-10 lg:mt-14 lg:pt-14">
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-200 md:text-xl lg:text-2xl">
              Contributors
            </h3>
            <p class="mt-3 leading-loose md:mt-4 md:text-lg md:leading-loose lg:mt-5 lg:text-xl lg:leading-loose">
              Thanks to all the contributors who helped make this documentation
              better!
            </p>
            <ul class="mt-4 flex flex-wrap gap-2 md:mt-5 lg:mt-6 lg:gap-3">
              {contributors.value.map((contributor) => (
                <li key={contributor}>
                  <a
                    href={`https://github.com/${contributor}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      loading="lazy"
                      src={`https://github.com/${contributor}.png?size=88`}
                      alt={`GitHub profile picture of ${contributor}`}
                      class="w-9 rounded-full md:w-10 lg:w-11"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentPage.value?.href && (
          <div class="mt-10 flex justify-between px-8 md:mt-12 lg:mt-14 lg:px-10">
            {/* GitHub buttton */}
            <IconButton
              variant="secondary"
              type="link"
              href={`https://github.com/fabian-hiller/valibot/blob/main/website/src/routes${currentPage.value.href.replace(
                /^(\/.+)\/(.+\/)$/,
                `$1/(${currentPage.value.group
                  .toLowerCase()
                  .replace(/\s/g, '-')})/$2`
              )}index.mdx`}
              target="_blank"
              label="Edit page"
            >
              <PenIcon class="h-[18px]" />
            </IconButton>

            {/* Next page button */}
            {nextPage.value?.href && (
              <div class="hidden lg:block">
                <IconButton
                  variant="secondary"
                  type="link"
                  href={nextPage.value.href}
                  label="Next page"
                  align="right"
                >
                  <ArrowRightIcon class="h-[18px]" />
                </IconButton>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
});

type NavButtonsProps = {
  pageIndex: number;
  prevPage?: ContentMenu;
  nextPage?: ContentMenu;
};

/**
 * Buttons to navigate to the previous or next page.
 */
export const NavButtons = component$<NavButtonsProps>(
  ({ pageIndex, prevPage, nextPage }) => (
    <>
      {pageIndex !== -1 && (
        <>
          {prevPage?.href ? (
            <IconButton
              variant="secondary"
              type="link"
              href={prevPage.href}
              label="Previous page"
              hideLabel
            >
              <ArrowLeftIcon class="h-[18px]" />
            </IconButton>
          ) : (
            <div class="w-10" />
          )}
          {nextPage?.href ? (
            <IconButton
              variant="secondary"
              type="link"
              href={nextPage.href}
              label="Next page"
              hideLabel
            >
              <ArrowRightIcon class="h-[18px]" />
            </IconButton>
          ) : (
            <div class="w-10" />
          )}
        </>
      )}
    </>
  )
);
