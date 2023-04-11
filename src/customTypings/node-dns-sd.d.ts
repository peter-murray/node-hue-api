declare module 'node-dns-sd' {

    class DnsSd {
        discover(params: DiscoverOptions): Promise<any[] | undefined>
    }

    interface DiscoverOptions {
        name: string
        type?: string
        key?: string
        wait?: number
        quick?: boolean
        filter?: string | Function
    }

    const exports: DnsSd;
     export default exports;
}
