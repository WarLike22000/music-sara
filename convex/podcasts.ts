import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const createPodcast = mutation({
    args: {
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioUrl: v.string(),
        imageUrl: v.string(),
        views: v.number(),
        audioDuration: v.number(),
        audioStorageId: v.id('_storage'),
        imageStorageId: v.id('_storage'),
        category: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new ConvexError("Not authenticated");
        };

        const user = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('email'), identity.email))
            .collect()

        if(user.length === 0) {
            throw new ConvexError("user not found");
        };

        const podcast = await ctx.db.insert('podcasts', {
            ...args,
            user: user[0]._id,
            author: user[0].name,
            authorId: user[0].clerkId,
            authorImageUrl: user[0].imageUrl
        });

        return podcast;
    }
});

export const getTrendingPodcast = query({
    handler: async (ctx) => {
        const podcasts = await ctx.db.query('podcasts').collect();

        return podcasts.sort((a, b) => b.views - a.views).slice(0, 6);
    }
});

export const getPodcastById = query({
    args: {
        podcastId: v.id('podcasts'),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.podcastId);
    }
});

export const getPodcastsByCategory = query({
    args: {
        podcastId: v.id('podcasts'),
    },
    handler: async (ctx, args) => {
        const podcast = await ctx.db.get(args.podcastId);

        return await ctx.db
            .query('podcasts')
            .filter((q) => 
                q.and(
                    q.eq(q.field('category'), podcast?.category),
                    q.neq(q.field('_id'), args.podcastId)
                )
            )
            .collect()
    }
});

export const deletePodcast = mutation({
    args: {
        podcastId: v.id("podcasts"),
        imageStorageId: v.id("_storage"),
        audioStorageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const podcast = await ctx.db.get(args.podcastId);

        if(!podcast) {
            throw new ConvexError("podcast not found");
        };

        await ctx.storage.delete(args.imageStorageId);
        await ctx.storage.delete(args.audioStorageId);
        return await ctx.db.delete(args.podcastId);
    }
});

export const getPodcastBySearch = query({
    args: {
        search: v.string(),
    },
    handler: async (ctx, args) => {
        if(args.search === "") {
            return await ctx.db.query("podcasts").order("desc").collect();
        };

        const authorSearch = await ctx.db
            .query("podcasts")
            .withSearchIndex("search_author", (q) => q.search("author", args.search))
            .take(10);

        if(authorSearch.length > 0) {
            return authorSearch;
        };

        const titleSearch = await ctx.db
            .query("podcasts")
            .withSearchIndex("search_title", (q) => q.search("podcastTitle", args.search))
            .take(10);

        if(titleSearch.length > 0) {
            return titleSearch;
        };

        return await ctx.db
            .query("podcasts")
            .withSearchIndex("search_body", (q) => q.search("podcastDescription", args.search))
            .take(10);
    },
});

export const getPodcastByAuthorId = query({
    args: {
        authorId: v.string(),
    },
    handler: async (ctx, args) => {
        const podcasts = await ctx.db
            .query("podcasts")
            .filter((q) => q.eq(q.field('authorId'), args.authorId))
            .collect()

        const totalListener = podcasts.reduce(
            (sum, podcast) => sum + podcast.views, 0
        );

        return {
            podcasts,
            listeners: totalListener,
        }
    }
});