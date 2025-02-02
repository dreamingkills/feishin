import { forwardRef, Fragment, Ref } from 'react';
import { Group, Stack } from '@mantine/core';
import { useParams } from 'react-router';
import { LibraryItem } from '/@/renderer/api/types';
import { Text } from '/@/renderer/components';
import { useAlbumArtistDetail } from '/@/renderer/features/artists/queries/album-artist-detail-query';
import { LibraryHeader } from '/@/renderer/features/shared';
import { AppRoute } from '/@/renderer/router/routes';
import { formatDurationString } from '/@/renderer/utils';
import { useCurrentServer } from '../../../store/auth.store';

interface AlbumArtistDetailHeaderProps {
    background: string;
}

export const AlbumArtistDetailHeader = forwardRef(
    ({ background }: AlbumArtistDetailHeaderProps, ref: Ref<HTMLDivElement>) => {
        const { albumArtistId } = useParams() as { albumArtistId: string };
        const server = useCurrentServer();
        const detailQuery = useAlbumArtistDetail({
            query: { id: albumArtistId },
            serverId: server?.id,
        });

        const metadataItems = [
            {
                id: 'albumCount',
                secondary: false,
                value: detailQuery?.data?.albumCount && `${detailQuery?.data?.albumCount} albums`,
            },
            {
                id: 'songCount',
                secondary: false,
                value: detailQuery?.data?.songCount && `${detailQuery?.data?.songCount} songs`,
            },
            {
                id: 'duration',
                secondary: true,
                value:
                    detailQuery?.data?.duration && formatDurationString(detailQuery.data.duration),
            },
        ];

        return (
            <LibraryHeader
                ref={ref}
                background={background}
                imageUrl={detailQuery?.data?.imageUrl}
                item={{ route: AppRoute.LIBRARY_ALBUM_ARTISTS, type: LibraryItem.ALBUM_ARTIST }}
                title={detailQuery?.data?.name || ''}
            >
                <Stack>
                    <Group>
                        {metadataItems
                            .filter((i) => i.value)
                            .map((item, index) => (
                                <Fragment key={`item-${item.id}-${index}`}>
                                    {index > 0 && <Text $noSelect>•</Text>}
                                    <Text $secondary={item.secondary}>{item.value}</Text>
                                </Fragment>
                            ))}
                    </Group>
                </Stack>
            </LibraryHeader>
        );
    },
);
