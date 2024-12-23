import { NextRouter } from "next/router";

export default (router: NextRouter) => {
    return router.push({
        pathname: '/painel'
    });

}