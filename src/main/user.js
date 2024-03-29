import uniqBy from "lodash/uniqBy";
import { Helmet } from "react-helmet";

import Header, { PersonSection } from "~/components/Header";
import TimeGroupedSketches from "~/components/timeGroupedSketches";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { ALL_SKETCHES_PATH } from "~/utils/network";

const User = ({ id }) => {
  const { data: allSketches } = useSWR(ALL_SKETCHES_PATH);

  const allUsers = allSketches?.map((sketch) => sketch.user) || [];
  const uniqueUsers = uniqBy(allUsers, (user) => user?.id) || [];
  let users = uniqueUsers.map((u) => {
    const sketches = allSketches.filter((s) => s.user?.id === u?.id);
    return { ...u, sketches };
  });

  let user = users.find((user) => user?.id === parseInt(id));

  if (!user) return <Logo className="loading-spinner" />;

  const { sketches = [] } = user;

  return (
    <div className="flex flex-col flex-grow">
      <Header
        sections={[{ title: "Gallery", to: "/gallery" }]}
        title={<PersonSection user={user} />}
      />

      <Helmet>
        <title>{user?.name}</title>
        <meta content={user?.name} property="og:title" />
        <meta
          content={`Sketches by ${user?.name} in Soulmate IDE`}
          property="og:description"
        />
        <meta content={user.image} property="og:image" />
      </Helmet>

      <div className="flex-grow overflow-auto bg-white dark-mode:bg-gray-900 dark-mode:text-white">
        <TimeGroupedSketches sketches={sketches} />
      </div>
    </div>
  );
};

export default User;
